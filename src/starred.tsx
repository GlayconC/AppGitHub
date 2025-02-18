import React, { useState } from 'react';
import { useUserStore } from './store';
import useSWR from 'swr';

const GITHUB_TOKEN = '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';

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  }).then((res) => res.json());

const Starred: React.FC = () => {
  const { user, setUser } = useUserStore();
  const [username, setUsername] = useState('GlayconC');

  const { data: userData, error: userError } = useSWR(
    `https://api.github.com/users/${username}`,
    fetcher
  );

  const { data: starredData, error: starredError } = useSWR(
    `https://api.github.com/users/${username}/starred`,
    fetcher
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser(username);
    console.log(userData, starredData);
  };

  return (
    <div className='pt-30'>
      <h1>Favoritos</h1>
      <p>Usuário: {userData?.name || 'Desconhecido'}</p>
      <p>Quantidade de Favoritos: {starredData?.length || 0}</p>
    </div>
  );
};

export default Starred;
