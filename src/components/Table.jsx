// src/components/Table.jsx
import React, { useState, useEffect } from 'react';
import { callPerson } from '../api/wca';

async function fetchPersonsData(persons_to_search) {
    const personsData = await Promise.all(
        persons_to_search.map(async (id) => {
            const data = await callPerson(id);
            return data;
        })
    );
    return personsData;
}

function centiToTime(centiseconds, category) {
    if (centiseconds === '-') return '-';
    if (category === '333fm') return centiseconds
    if (centiseconds === 0) return '-';
    const minutes = Math.floor(centiseconds / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const centis = centiseconds % 100;
    if (minutes > 0) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
    }
    return `${seconds}.${centis.toString().padStart(2, '0')}`;
}

const Table = () => {

    const allCategories =
        [
            "222",
            "333",
            "444",
            "555",
            "666",
            "777",
            "333bf",
            "333fm",
            "333oh",
            "clock",
            "minx",
            "pyram",
            "skewb",
            "sq1",
            "444bf",
            "555bf",
            "333mbf"
        ]

    const initialVisibleCategories = ["333", "444", "555", "clock"];


    const string_persons = import.meta.env.VITE_WCA_IDS

    const persons_to_search = string_persons.split(',')



    const [personsData, setPersonsData] = useState([]);
    const [sortedCategory, setSortedCategory] = useState(null);
    const [displayType, setDisplayType] = useState('single');
    const [sortOrder, setSortOrder] = useState('asc');
    const [visibleCategories, setVisibleCategories] = useState(initialVisibleCategories);


    useEffect(() => {
        async function fetchData() {
            const data = await fetchPersonsData(persons_to_search);
            setPersonsData(data);
            setSortOrder('asc')
            handleSort('333');

        }
        fetchData();
    }, []);


    const handleSort = (category) => {
        // const type = displayType === 'avg' ? 'average' : 'single';
        // Alternar el orden de clasificación
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        setSortedCategory(`${category}-${displayType}`);

        // Ordenar los datos
        const sortedData = [...personsData].sort((a, b) => {
            const timeA = a.personal_records[category]?.[displayType]?.best || Infinity;
            const timeB = b.personal_records[category]?.[displayType]?.best || Infinity;

            // Si el tiempo es Infinity, asegúrate de que estos se ordenen al final en orden ascendente, o al principio en orden descendente
            if (timeA === Infinity && timeB === Infinity) return 0;
            if (timeA === Infinity) return newSortOrder === 'asc' ? 1 : -1;
            if (timeB === Infinity) return newSortOrder === 'asc' ? -1 : 1;

            // Ordenar los tiempos reales
            return newSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        });

        // Actualizar el estado con los datos ordenados
        setPersonsData(sortedData);
    };

    const handleCompetitionCount = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        const sortedData = [...personsData].sort((a, b) => {
            return newSortOrder === 'asc' ? a.competition_count - b.competition_count : b.competition_count - a.competition_count;
        });
        setPersonsData(sortedData);
    }

    const handleCategoryChange = (category) => {
        setVisibleCategories(prevState =>
            prevState.includes(category)
                ? prevState.filter(c => c !== category)
                : [...prevState, category]
        );
    };



    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">CubiKonce</h1>
            <div className="mb-6 flex space-x-2">
                <button
                    onClick={() => setDisplayType('single')}
                    className={`w-full px-4 py-2 border rounded ${displayType === 'single' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                >
                    Mostrar Single
                </button>
                <button
                    onClick={() => setDisplayType('average')}
                    className={`w-full px-4 py-2 border rounded ${displayType === 'average' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                >
                    Mostrar Average
                </button>
            </div>


            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Seleccionar Categorías</h2>
                <div className="flex flex-wrap">
                    {allCategories.map((category) => (
                        <label key={category} className="mr-4">
                            <input
                                type="checkbox"
                                checked={visibleCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="mr-2"
                            />
                            {category}
                        </label>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">N°</th>
                            <th className="border p-2 hidden md:block">Foto</th>
                            <th className="border p-2 ">WCA ID</th>
                            <th className="border p-2">Nombre</th>
                            {allCategories.map((category) => (
                                visibleCategories.includes(category) && (
                                    <th
                                        key={category}
                                        className="border p-2 cursor-pointer"
                                        onClick={() => handleSort(category)}
                                    >
                                        {category} {displayType === 'single' ? 'Single' : 'Average'}
                                        {sortedCategory === `${category}-${displayType}` && (
                                            <span className={`ml-2 ${sortOrder === 'asc' ? 'text-blue-500' : 'text-red-500'}`}>
                                                {sortOrder === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </th>
                                )
                            ))}
                            <th className="border p-2">Oro</th>
                            <th className="border p-2">Plata</th>
                            <th className="border p-2">Bronce</th>
                            {/* <th className="border p-2">NR</th>
                            <th className="border p-2">SAR</th>
                            <th className="border p-2">WR</th> */}
                            <th
                                className="border p-2"
                                onClick={() => handleCompetitionCount()}>
                                Competiciones
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {personsData.length > 0 ? (
                            personsData.map((person, index) => (
                                <tr key={person.wca_id} className="hover:bg-gray-100">
                                    <td className="border">
                                        {index + 1}
                                    </td>
                                    <td className="border hidden md:block">
                                        <img
                                            src={person.person.avatar.url}
                                            alt={person.person.name}
                                            className="w-12 h-12 object-cover rounded-full"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <a
                                            href={`https://www.worldcubeassociation.org/persons/${person.person.wca_id}`}
                                            target='_blank'
                                            className='text-blue-500 hover:text-blue-700 hover:text-xl'
                                        >
                                            {person.person.wca_id}
                                        </a>
                                    </td>
                                    <td className="border p-2">{person.person.name}</td>
                                    {allCategories.map((category) => (
                                        visibleCategories.includes(category) && (
                                            <td
                                                key={`${person.wca_id}-${category}`}
                                                className="border p-2"
                                            >
                                                {person.personal_records[category] ? (
                                                    displayType === 'single' ?
                                                        centiToTime(
                                                            person.personal_records[category]?.single.best || '-', category
                                                        ) : centiToTime(
                                                            person.personal_records[category]?.average?.best || '-', category
                                                        )
                                                ) : '-'}
                                            </td>
                                        )
                                    ))}
                                    <td className="border p-2">{person.medals?.gold || 0}</td>
                                    <td className="border p-2">{person.medals?.silver || 0}</td>
                                    <td className="border p-2">{person.medals?.bronze || 0}</td>
                                    {/* <td className="border p-2">{person.records?.national || 0}</td>
                                    <td className="border p-2">{person.records?.continental || 0}</td>
                                    <td className="border p-2">{person.records?.world || 0}</td> */}
                                    <td className="border p-2">{person.competition_count}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={allCategories.length + 8} className="border p-2 text-center">Cargando</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
