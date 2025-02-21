import React, { useState, useEffect } from 'react';
import { useUserStore } from './store';
import useSWR from 'swr';
import Repos from './repos';
import Starred from './starred'

const App: React.FC = () => {
 
  const { user, setUser } = useUserStore();
  
  const [username, setUsername] = useState('GlayconC');
  const [button, setButton] = useState(0)
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("All");
  const [isOpenType, setIsOpenType] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [infAd, setInfAd] = useState(false);
  const [showInput, setShowInput] = useState(false);

  
  const { data, error } = useSWR(
    [
      `https://api.github.com/users/${username}`,
      `https://api.github.com/users/${username}/starred`,
    ],
    async ([userUrl, starredUrl]) => {
      const fetchWithToken = (url: string) =>
        fetch(url
        ).then((res) => res.json());

      const [userData, starredData] = await Promise.all([
        fetchWithToken(userUrl),
        fetchWithToken(starredUrl),
      ]);

      return { userData, starredCount: starredData.length };
    }
  );

 
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser(username);
  };

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 640) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col sm:flex-row pl-5 2xl:px-100">
      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="p-4 w-full max-w-sm text-center">
          {data && (
            <div className='pt-5'>
              <div className='items-center justify-center py-2 pl-30 sm:pl-0 '>
                <div className='pl-5'>
                  <img
                    src={data.userData.avatar_url}
                    alt="Avatar"
                    className="w-40 h-40 rounded-full"
                  />
                </div>
                <div className="text-left pl-6 pt-3">
                  <p className="text-[20px] font-semibold text-black">{data.userData.name || 'Name'}</p>
                </div>
                <p className="text-[10px] text-gray-500 leading-5 w-[200px] ">{data.userData.bio || 'Bio'}</p>
              </div>
              {isMobile ? (
                <div>
                  <div>
                    <button
                      className='text-blue-500 hover:text-blue-800 justify-center items-center pl-22 pt-7'
                      onClick={() => setInfAd(!infAd)}
                    >
                      <p>Informações Adicionais</p>
                      {infAd ? (
                        <p>▲</p>
                      ) : (
                        <p>▼</p>
                      )}
                    </button>
                  </div>
                  <div>
                    {infAd === true && (
                      <div className="text-left pt-7 ">
                        <a className="text-[15px] text-blue-800 leading-5">{`🏢 ${data.userData.company}` || 'Company'}</a>
                        <br />
                        <a className="text-[15px] text-blue-800 leading-12">{`🌍 ${data.userData.location}` || 'Location'}</a>
                        <br />
                        <a
                          href={data.userData.blog || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px]"
                        >
                          {data.userData.blog ? `📸 ${data.userData.name}` : 'Blog'}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-left pt-7 ">
                  <a className="text-[15px] text-blue-500 leading-8 ">{`🏢 ${data.userData.company}` || 'Company'}</a>
                  <br />
                  <a className="text-[15px] text-blue-500 leading-5">{`🌍 ${data.userData.location}` || 'Location'}</a>
                  <br />
                  <a
                    href={data.userData.blog || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px]"
                  >
                    {data.userData.blog ? `📸 ${data.userData.name}` : 'Blog'}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="p-5 pt-8 w-full rounded-lg">
          {button === 0 && (
            <div className='flex space-x-20'>
              <button className="px-6 py-2 text-black-400 rounded-lg items-center flex text-xl border-b-3 rounded-none border-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="16" height="16" className="fill-black">
                  <path d="M17,0H7C4.243,0,2,2.243,2,5v15c0,2.206,1.794,4,4,4h11c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm3,5v11H8V2h4V10.347c0,.623,.791,.89,1.169,.395l1.331-1.743,1.331,1.743c.378,.495,1.169,.228,1.169-.395V2c1.654,0,3,1.346,3,3ZM6,2.184v13.816c-.732,0-1.409,.212-2,.556V5c0-1.302,.839-2.402,2-2.816Zm11,19.816H6c-2.629-.047-2.627-3.954,0-4h14v1c0,1.654-1.346,3-3,3Z" />
                </svg>
                &nbsp;
                Repositories
                &nbsp;
                <div className="flex items-center justify-center w-6 h-6 bg-white text-gray-500 rounded-full text-xs">
                  {data.userData.public_repos}
                </div>
              </button>
              <button
                className="px-4 py-2 text-gray-500 rounded-lg items-center flex text-xl"
                onClick={() => setButton(1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="16" height="16" className="fill-gray-500">
                  <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
                </svg>
                &nbsp;
                Starred
                &nbsp;
                <div className="flex items-center justify-center w-6 h-6 bg-white text-gray-500 rounded-full text-xs">
                  {data.starredCount}
                </div>
              </button>
            </div>
          )}
          {button === 1 && (
            <div className='flex space-x-20'>
              <button
                className="px-6 py-2 text-gray-500 rounded-lg items-center flex text-xl "
                onClick={() => setButton(0)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="16" height="16" className="fill-gray-500">
                  <path d="M17,0H7C4.243,0,2,2.243,2,5v15c0,2.206,1.794,4,4,4h11c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm3,5v11H8V2h4V10.347c0,.623,.791,.89,1.169,.395l1.331-1.743,1.331,1.743c.378,.495,1.169,.228,1.169-.395V2c1.654,0,3,1.346,3,3ZM6,2.184v13.816c-.732,0-1.409,.212-2,.556V5c0-1.302,.839-2.402,2-2.816Zm11,19.816H6c-2.629-.047-2.627-3.954,0-4h14v1c0,1.654-1.346,3-3,3Z" />
                </svg>
                &nbsp;
                Repositories
                &nbsp;
                <div className="flex items-center justify-center w-6 h-6 bg-white text-gray-500 rounded-full text-xs">
                  {data.userData.public_repos}
                </div>
              </button>
              <button className="px-4 py-2 text-black-400 rounded-lg items-center flex text-xl border-b-3 rounded-none border-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="16" height="16" className="fill-black-400">
                  <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
                </svg>
                &nbsp;
                Starred
                &nbsp;
                <div className="flex items-center justify-center w-6 h-6 bg-white text-gray-500 rounded-full text-xs">
                  {data.starredCount}
                </div>
              </button>
            </div>
          )}

          {isMobile ? (
            <div className="pt-12 flex relative">
              <div className='flex'>
                <div className="pr-3 relative whitespace-nowrap">
                  <button
                    onClick={() => (setIsOpenType(!isOpenType), setIsOpen(false))}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  >
                    ⌄ Type
                  </button>
                  {isOpenType && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-4">Escolha o Tipo</h2>
                        <div className="space-y-2">
                          {["All", "Sources", "Forks", "Archived", "Mirrors"].map((opcaoType) => (
                            <label key={opcaoType} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                value={opcaoType}
                                checked={selectedType === opcaoType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="form-radio text-blue-500"
                              />
                              <span>{opcaoType}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => setIsOpenType(false)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Fechar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
                <div className="whitespace-nowrap pr-3">
                  <button
                    onClick={() => (setIsOpen(!isOpen), setIsOpenType(false))}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  >
                    ⌄ Language
                  </button>
                  {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-4">Escolha o Tipo</h2>
                        <div className="space-y-2">
                          {["All", "Java", "TypeScript", "HTML", "CSS"].map((opcao) => (
                            <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                value={opcao}
                                checked={selected === opcao}
                                onChange={(e) => setSelected(e.target.value)}
                                className="form-radio text-blue-500"
                              />
                              <span>{opcao}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Fechar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='flex items-center pl-50'>
                <button
                  onClick={() => setShowInput(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-7 h-10 text-blue-600 left-3 transform hover:text-blue-800"
                  >
                    <path d="M10,2A8,8,0,1,0,18,10,8,8,0,0,0,10,2Zm0,14A6,6,0,1,1,16,10,6,6,0,0,1,10,16ZM21.71,20.29l-5.4-5.4a1,1,0,1,0-1.42,1.42l5.4,5.4a1,1,0,0,0,1.42-1.42Z" fill="currentColor" />

                  </svg>
                </button>
              </div>
              {showInput && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-10">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <input
                      type="text"
                      placeholder=" 🔍 Type Something Here"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setShowInput(false)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-12 flex relative gap-2 flex-col-reverse sm:flex-col-reverse lg:flex-row">
              <div className='flex items-center md:pt-3'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-gray-400  left-3 transform "
                >
                  <path d="M10,2A8,8,0,1,0,18,10,8,8,0,0,0,10,2Zm0,14A6,6,0,1,1,16,10,6,6,0,0,1,10,16ZM21.71,20.29l-5.4-5.4a1,1,0,1,0-1.42,1.42l5.4,5.4a1,1,0,0,0,1.42-1.42Z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search Here"
                  className="border-b-2 border-gray-300 px-4 py-2 focus:outline-none w-110 text-xl placeholder-gray-600"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className='flex'>
                <div className="pl-4 md:pl-1 pr-3 relative whitespace-nowrap">
                  <button
                    onClick={() => (setIsOpenType(!isOpenType), setIsOpen(false))}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  >
                    ⌄ Type
                  </button>
                  {isOpenType && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <div className="p-2 space-y-2">
                        {["All", "Sources", "Forks", "Archived", "Mirrors"].map((opcaoType) => (
                          <label key={opcaoType} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              value={opcaoType}
                              checked={selectedType === opcaoType}
                              onChange={(e) => setSelectedType(e.target.value)}
                              className="form-radio text-blue-500"
                            />
                            <span>{opcaoType}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative whitespace-nowrap">
                  <button
                    onClick={() => (setIsOpen(!isOpen), setIsOpenType(false))}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  >
                    ⌄ Language
                  </button>
                  {isOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <div className="p-2 space-y-2">
                        {["All", "Java", "TypeScript", "HTML", "CSS"].map((opcao) => (
                          <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              value={opcao}
                              checked={selected === opcao}
                              onChange={(e) => setSelected(e.target.value)}
                              className="form-radio text-blue-500"
                            />
                            <span>{opcao}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div>
            {button === 0 && (
              <Repos username={username} type={selectedType} language={selected} search={search} />)}
            {button === 1 && (
              <Starred username={username} type={selectedType} language={selected} search={search} />)}
          </div>

        </div>
      )}
    </div>

  );
};

export default App;
