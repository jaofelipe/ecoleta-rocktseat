import React, {useEffect, useState, ChangeEvent } from 'react';
import {Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import './CreatePoint.css'
import api from '../../services/api';
import axios from 'axios';


//array ou objeto: manualmente informar o tipo da variável
interface Item{
    id: number,
    title: string,
    image_url: string;
}

interface IBGEUfResponse{
    sigla: string;
}
interface IBGECityResponse{
    nome: string;
}
const CreatePoint: React.FC = ()  =>{
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);  
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    useEffect(() => {
        api.get('items').then(response =>{
            setItems(response.data);
        });

    },[]);

    useEffect(() => {
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res =>{
            const ufInitials = res.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        })
    },[]);

    useEffect(() => {
        if (selectedUf === '0') return;

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cities = response.data.map(city => city.nome);
                setCities(cities);
            })
    }
    ,[selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf= event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    }


    return (
       <div id="page-create-point">
           <header>
               <img src="{logo}" alt="Ecoleta" />

               <Link to="/">
                   <FiArrowLeft />
                   Voltar para home
               </Link>
           </header>
       
       <form>
           <h1>Cadastro do <br /> ponto de coleta</h1>
           <fieldset>
               <legend>
                   <h2>Dados</h2>
               </legend>
                <div className="field">
                    <label htmlFor="name">Nome da entidade</label>
                    <input type="text" id="name" name="name" />
                </div>
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" />
                    </div>

                    <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input type="text" id="whatsapp" name="whatsapp" />
                    </div>
                </div>
           </fieldset>

           <fieldset>
               <legend>
                   <h2>Endereços</h2>
                   <span>Selecione o endereço no mapa</span>
               </legend>
           </fieldset>

           <Map center={[-22.4518436, -43.8195373]} zoom={15}>
                <TileLayer 
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            <Marker position={[-22.4518436, -43.8195373]} />
          
           </Map>

           <div className="field-group">
               <div className="field">
                   <label htmlFor="uf">Estado (UF)</label>
                   <select 
                        name="uf" 
                        value={selectedUf} 
                        id="uf" 
                        onChange={handleSelectUf} >
                       <option value="0">Selecione uma UF</option>
                       {ufs.map(uf => (
                            <option key={uf} value={uf}>{uf}</option>
                       ))}
                   </select>
               </div>
               <div className="field">
                   <label htmlFor="city">Cidade</label>
                   <select 
                        name="city" 
                        id="city"
                        value={selectedCity}
                        onChange={handleSelectCity} >

                       <option value="0">Selecione uma cidade</option>
                       {cities.map(city =>(
                            <option key={city} value={city}>{city}</option>

                       ))}
                   </select>
               </div>
           </div>

           <fieldset>
               <legend>
                   <h2>Ítens de coleta</h2>
                   <span>Selecione um ou mais ítens abaixo</span>
               </legend>

                <ul className="items-grid">
                    { items.map(item => ( 
                    <li key={item.id}>
                        <img src={item.image_url} alt={item.title} />
                        <span>{item.title}</span>
                    </li>
                   )) }
                </ul>

           </fieldset>
       </form>
       </div>
    );
}
export default CreatePoint;