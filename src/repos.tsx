import React from 'react';
import { useUserStore } from './store';
import useSWR from 'swr'

type ReposProps = {
  username: string;
  type: string;
  language: string;
  search: string;
};


const Repos: React.FC<ReposProps> = ({ username, type, language, search }) => {


  const { user, setUser } = useUserStore();

  const fetchWithToken = (url: string) =>
    fetch(url).then((res) => res.json());

  const { data, error } = useSWR(
    [`https://api.github.com/users/${username}/repos`],
    async ([reposUrl]) => {
      const reposData = await fetchWithToken(reposUrl); 
      return { reposData };
    }
  );


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data?.reposData) {
      setUser(data.reposData);
    }
  };


  if (error) return <p>Erro ao carregar os repositórios.</p>;
  if (!data) return <p>Carregando...</p>;

  const filteredRepos = data.reposData?.filter((repo: any) => {
    const repoName = repo.name?.toLowerCase() || "";
    const repoType = repo.fork ? "Forks" : repo.archived ? "Archived" : repo.mirror_url ? "Mirrors" : "Sources";
    const repoLanguage = repo.language || "Other";

    const searchQuery = search.toLowerCase();
    const typeQuery = type;
    const languageQuery = language;

    return (
      repoName.includes(searchQuery) &&
      (typeQuery === "All" || repoType === typeQuery) &&
      (languageQuery === "All" || repoLanguage === languageQuery)
    );
  });

  return (
    <div className='pt-8'>
      <ul className="space-y-2">
        {filteredRepos?.map((repo: any) => (
          <li key={repo.id} className="p-3 border-b border-gray-200">
            <h2 className="text-lg">
              {repo.owner.login} /
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1 font-semibold"
              >
                {repo.name}
              </a>
            </h2>
            <p className="text-gray-500 pt-1">{repo.description || "Sem descrição disponível"}</p>
            <div className='flex items-center space-x-3 pt-1'>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24">
                  <path d="M19.467,23.316,12,17.828,4.533,23.316,7.4,14.453-.063,9H9.151L12,.122,14.849,9h9.213L16.6,14.453Z" />
                </svg>
                <div className="w-20 text-sm truncate">
                  <p>{repo.starfazers_count || "0"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 512.19 512.19">
                  <g>
                    <circle cx="256.095" cy="256.095" r="85.333" />
                    <path d="M496.543,201.034C463.455,147.146,388.191,56.735,256.095,56.735S48.735,147.146,15.647,201.034   
                      c-20.862,33.743-20.862,76.379,0,110.123c33.088,53.888,108.352,144.299,240.448,144.299s207.36-90.411,240.448-144.299   
                      C517.405,277.413,517.405,234.777,496.543,201.034z M256.095,384.095c-70.692,0-128-57.308-128-128s57.308-128,128-128   
                      s128,57.308,128,128C384.024,326.758,326.758,384.024,256.095,384.095z"/>
                  </g>
                </svg>
                <p className="text-sm">{repo.watchers || 0}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Repos;
