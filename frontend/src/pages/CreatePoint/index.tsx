import React, {useEffect, useState, ChangeEvent } from 'react';
import {Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import './CreatePoint.css'
import api from '../../services/api';
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios';
import { useForm } from 'react-hook-form';

type FormData = {
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
    position: [number,number]
  };

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
    const { register, handleSubmit } = useForm<FormData>();
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);  
    const [cities, setCities] = useState<string[]>([]);
    const [initalPosition, setInitialPosition] = useState<[number,number]>([0,0]);

    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position =>{
            const { latitude, longitude} = position.coords;
            console.log(latitude, longitude);
            setInitialPosition([latitude, longitude]);
        })
    },[]);


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

    

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf= event.target.value;       
        if (uf === '0') return;

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then(response => {
                const cities = response.data.map(city => city.nome);
                setCities(cities);
            })
    }

    

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    const onSubmit = handleSubmit(({ name, email, whatsapp, uf, city, position }) => {
        console.log(name, email, whatsapp, uf, city, position);

    });


    return (
       <div id="page-create-point">
           <header>
               <img src="{logo}" alt="Ecoleta" />

               <Link to="/">
                   <FiArrowLeft />
                   Voltar para home
               </Link>
           </header>
       
       <form onSubmit={onSubmit}>
           <h1>Cadastro do <br /> ponto de coleta</h1>
           <fieldset>
               <legend>
                   <h2>Dados</h2>
               </legend>
                <div className="field">
                    <label htmlFor="name">Nome da entidade</label>
                    <input type="text" name="name" ref={register} />
                </div>
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" ref={register}  />
                    </div>

                    <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input type="text" name="whatsapp" ref={register}  />
                    </div>
                </div>
           </fieldset>

           <fieldset>
               <legend>
                   <h2>Endereços</h2>
                   <span>Selecione o endereço no mapa</span>
               </legend>
           </fieldset>

            {/* [-22.4518436, -43.8195373] */}
           <Map center={[-22.4518436, -43.8195373]} zoom={15} onClick={handleMapClick}>
                <TileLayer 
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            <Marker name="position" position={selectedPosition} ref={register} />
          
           </Map>

           <div className="field-group">
               <div className="field">
                   <label htmlFor="uf">Estado (UF)</label>
                   <select 
                        name="uf" 
                        onChange={handleSelectUf}
                        ref={register} >
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
                        ref={register}>
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
           <button type="submit">Cadastrar ponto de coleta</button>
       </form>
       </div>
    );
}
export default CreatePoint;