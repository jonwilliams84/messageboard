import { FormEvent, useState } from "react";
import styled from "styled-components";
import { api } from "../api";
import { setToken } from "../auth";

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { token } = await api.login(password);
      setToken(token);
      onSuccess();
    } catch {
      setError("Wrong password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Wrap>
      <Card onSubmit={submit}>
        <h1>Message Board Admin</h1>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <Error>{error}</Error>}
        <Submit disabled={busy}>{busy ? "..." : "Sign in"}</Submit>
      </Card>
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  background: #1a1a1a;
`;

const Card = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  background: #262626;
  border-radius: 8px;
  min-width: 320px;
  h1 { font-size: 1.5rem; color: #f0f0f0; text-align: center; }
`;

const Input = styled.input`
  height: 44px;
  padding: 0 12px;
  font-size: 1rem;
  background: #1a1a1a;
  color: #f0f0f0;
  border: 1px solid #444;
  border-radius: 4px;
`;

const Submit = styled.button`
  height: 44px;
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Error = styled.div`
  color: #e26060;
  font-size: 0.9rem;
  text-align: center;
`;
