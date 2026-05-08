import { ChangeEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { api } from "../api";
import { clearToken, getToken } from "../auth";
import { Background, BoardAnimation, BoardState, Line, TextEffect, Texture } from "../types";
import { LineEditor } from "../components/LineEditor";
import { Toggle } from "../components/Toggle";
import { Preview } from "../components/Preview";
import { BackgroundEditor } from "../components/BackgroundEditor";
import { FontSelect } from "../components/FontSelect";
import { TextEffectSelect } from "../components/TextEffectSelect";
import { Login } from "./Login";

const newLine = (): Line => ({ id: crypto.randomUUID(), text: "", color: null, font: null, textEffect: null });

function bgFallback(bg: Background): string {
  return bg.type === "solid" ? bg.color : bg.from;
}

export function Admin() {
  const [authed, setAuthed] = useState(!!getToken());
  const [authRequired, setAuthRequired] = useState(true);
  const [draft, setDraft] = useState<BoardState | null>(null);
  const [saved, setSaved] = useState<BoardState | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okFlash, setOkFlash] = useState(false);

  useEffect(() => {
    api.authConfig().then(({ required }) => {
      setAuthRequired(required);
      if (!required) setAuthed(true);
    });
  }, []);

  useEffect(() => {
    if (!authed) return;
    api.getState().then((s) => {
      setDraft(s);
      setSaved(s);
    }).catch((e) => setError(String(e)));
    api.listImages().then(setImages).catch(() => {});
  }, [authed]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  if (!draft) return <Loading>Loading…</Loading>;

  const update = (patch: Partial<BoardState>) => setDraft({ ...draft, ...patch });
  const updateLines = (fn: (lines: Line[]) => Line[]) => setDraft({ ...draft, lines: fn(draft.lines) });

  async function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { name } = await api.uploadImage(file);
      setImages((prev) => [...prev, name]);
      update({ imageName: name });
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function onApply() {
    if (!draft) return;
    setBusy(true);
    setError(null);
    try {
      const next = await api.setState(draft);
      setSaved(next);
      setDraft(next);
      setOkFlash(true);
      setTimeout(() => setOkFlash(false), 1500);
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
    }
  }

  function onLogout() {
    clearToken();
    setAuthed(false);
  }

  return (
    <Page>
      <Header>
        <h1>Message Board</h1>
        <HeaderActions>
          <a href="/" target="_blank" rel="noreferrer">Open display ↗</a>
          {authRequired && <button onClick={onLogout}>Log out</button>}
        </HeaderActions>
      </Header>

      <Layout>
        <Editor>
          <Section>
            <SectionTitle>Lines</SectionTitle>
            {draft.lines.map((line, i) => (
              <LineEditor
                key={line.id}
                line={line}
                index={i}
                defaultColor={bgFallback(draft.background)}
                defaultFont={draft.defaultFont}
                onChange={(updated) => updateLines((ls) => ls.map((l) => (l.id === line.id ? updated : l)))}
                onRemove={() => updateLines((ls) => ls.filter((l) => l.id !== line.id))}
                canRemove={draft.lines.length > 1}
                onMoveUp={() => updateLines((ls) => swap(ls, i, i - 1))}
                onMoveDown={() => updateLines((ls) => swap(ls, i, i + 1))}
                canMoveUp={i > 0}
                canMoveDown={i < draft.lines.length - 1}
              />
            ))}
            <AddBtn onClick={() => updateLines((ls) => [...ls, newLine()])} disabled={draft.lines.length >= 8}>
              + Add line
            </AddBtn>
          </Section>

          <Section>
            <SectionTitle>Typography</SectionTitle>
            <Row>
              <Caption style={{ width: 90 }}>Default font</Caption>
              <FontSelect
                value={draft.defaultFont}
                onChange={(name) => update({ defaultFont: name ?? draft.defaultFont })}
              />
            </Row>
            <Row>
              <Caption style={{ width: 90 }}>Default effect</Caption>
              <TextEffectSelect
                value={draft.defaultTextEffect}
                onChange={(e: TextEffect | null) => update({ defaultTextEffect: e ?? "none" })}
              />
            </Row>
          </Section>

          <Section>
            <SectionTitle>Background &amp; effects</SectionTitle>
            <BackgroundEditor
              background={draft.background}
              texture={draft.texture}
              animation={draft.animation}
              onBackground={(background: Background) => update({ background })}
              onTexture={(texture: Texture) => update({ texture })}
              onAnimation={(animation: BoardAnimation) => update({ animation })}
            />
          </Section>

          <Section>
            <SectionTitle>Photo mode</SectionTitle>
            <Toggle
              checked={draft.photoMode}
              onChange={(v) => update({ photoMode: v })}
              label={draft.photoMode ? "Showing photo" : "Showing text"}
            />
            {draft.photoMode && (
              <PhotoControls>
                <UploadLabel>
                  <input type="file" accept="image/*" onChange={onUpload} hidden />
                  <span>Upload image</span>
                </UploadLabel>
                {images.length > 0 && (
                  <Gallery>
                    {images.map((name) => (
                      <Thumb
                        key={name}
                        $active={draft.imageName === name}
                        onClick={() => update({ imageName: name })}
                      >
                        <img src={api.imageUrl(name)} alt={name} />
                      </Thumb>
                    ))}
                  </Gallery>
                )}
              </PhotoControls>
            )}
          </Section>

          <Footer>
            <Apply onClick={onApply} disabled={busy || !dirty}>
              {busy ? "Saving…" : okFlash ? "Saved ✓" : dirty ? "Apply" : "No changes"}
            </Apply>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </Footer>
        </Editor>

        <PreviewPane>
          <PreviewLabel>Live preview</PreviewLabel>
          <Preview state={draft} />
          {dirty && <PreviewHint>Unsaved changes — press Apply to push to the display.</PreviewHint>}
        </PreviewPane>
      </Layout>
    </Page>
  );
}

function swap<T>(arr: T[], i: number, j: number): T[] {
  if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return arr;
  const next = arr.slice();
  const a = next[i] as T;
  next[i] = next[j] as T;
  next[j] = a;
  return next;
}

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  background: #1a1a1a;
  color: #f0f0f0;
  overflow: auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #333;
  h1 { font-size: 1.6rem; letter-spacing: 0.05em; }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  a, button {
    color: #aaa;
    background: none;
    border: 1px solid #444;
    border-radius: 4px;
    padding: 6px 12px;
    text-decoration: none;
    font: inherit;
    cursor: pointer;
    &:hover { color: #fff; border-color: #888; }
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Editor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.section`
  background: #232323;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  letter-spacing: 0.1em;
  color: #888;
  text-transform: uppercase;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Caption = styled.span`
  color: #888;
  font-size: 0.9rem;
`;

const AddBtn = styled.button`
  align-self: flex-start;
  background: transparent;
  border: 1px dashed #555;
  color: #ccc;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  &:hover { border-color: #4a90e2; color: #fff; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const PhotoControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UploadLabel = styled.label`
  align-self: flex-start;
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  &:hover { background: #3a3a3a; }
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
`;

const Thumb = styled.button<{ $active: boolean }>`
  aspect-ratio: 1;
  border: 2px solid ${(p) => (p.$active ? "#4a90e2" : "transparent")};
  border-radius: 4px;
  padding: 0;
  background: #111;
  cursor: pointer;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Apply = styled.button`
  height: 44px;
  padding: 0 32px;
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  &:disabled { background: #333; color: #777; cursor: not-allowed; }
`;

const ErrorMsg = styled.div`
  color: #e26060;
`;

const PreviewPane = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 24px;
  align-self: start;
`;

const PreviewLabel = styled.div`
  color: #888;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const PreviewHint = styled.div`
  color: #d4a04a;
  font-size: 0.9rem;
`;

const Loading = styled.div`
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
  color: #888;
`;
