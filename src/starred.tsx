import React from 'react';
import { useUserStore } from './store';
import useSWR from 'swr';

type StarredProps = {
  username: string;
  type: string;
  language: string;
  search: string;
};

const GITHUB_TOKEN = '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';

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  }).then((res) => res.json());

const Starred: React.FC<StarredProps> = ({ username, type, language, search }) => {
  const { user, setUser } = useUserStore();

  const { data, error } = useSWR(
    [`https://api.github.com/users/${username}/starred`],
    async ([starredUrl]) => {
      const starredData = await fetch(starredUrl).then((res) => res.json());
      return { starredData };
    }
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data?.starredData) {
      setUser(data.starredData);
    }
  };

  if (error) return <p>Erro ao carregar os favoritos.</p>;
  if (!data) return <p>Carregando...</p>;

  const filteredStarred = data.starredData?.filter((starred: any) => {
    const starredName = starred.name?.toLowerCase() || "";
    const starredType = starred.fork ? "Forks" : starred.archived ? "Archived" : starred.mirror_url ? "Mirrors" : "Sources";
    const starredLanguage = starred.language || "Other";

    const searchQuery = search.toLowerCase();
    const typeQuery = type;
    const languageQuery = language;

    return (
      starredName.includes(searchQuery) &&
      (typeQuery === "All" || starredType === typeQuery) &&
      (languageQuery === "All" || starredLanguage === languageQuery)
    );
  });

  return (
    <div className='pt-8'>
      <ul className="space-y-2">
      {filteredStarred?.map((starred: any) => (
        <li key={starred.id} className="p-3  border-b-1 border-gray-200">
          <h2 className="text-lg">
          {starred.owner.login} /  
          <a 
            href={starred.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline ml-1 font-semibold"
          >
            {starred.name}
          </a>
        </h2>
          <p className="text-gray-500 pt-1">{starred.description || "Sem descrição disponível"}</p>
          <div className='flex pt-1'>
            <div className='w-50'>
              <p>{starred.language}</p>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512.19 512.19" 
              className="w-5 h-5 text-gray-500"
            >
              <g>
                <circle cx="256.095" cy="256.095" r="85.333"/>
                <path d="M496.543,201.034C463.455,147.146,388.191,56.735,256.095,56.735S48.735,147.146,15.647,201.034   
                  c-20.862,33.743-20.862,76.379,0,110.123c33.088,53.888,108.352,144.299,240.448,144.299s207.36-90.411,240.448-144.299   
                  C517.405,277.413,517.405,234.777,496.543,201.034z M256.095,384.095c-70.692,0-128-57.308-128-128s57.308-128,128-128   
                  s128,57.308,128,128C384.024,326.758,326.758,384.024,256.095,384.095z"/>
              </g>
            </svg>
            <div className='pl-2 pr-6'>
              <p>{starred.watchers}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
    </div>
  );
};

export default Starred;
