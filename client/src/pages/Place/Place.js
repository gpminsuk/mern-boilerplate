import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {
  Link,
  useParams
} from "react-router-dom";

import Layout from '../../layout/Layout';

import './styles.css';

const Place = () => {
  console.log('asdfasdf')
  const { id } = useParams();
  console.log(id)
  const [place, setPlace] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`/api/places/${id}`, {});
      setPlace(response.data.place)
    }
    fetch()
  }, []);

  return (
    <Layout>
      <div className="place-page">
        {place &&
          <>
            <h1>Place page</h1>
            <h2>{place.name}</h2>
            {place.collections.map(collection =>
              <>
                <h3>{collection.name}</h3>
                <Link to={`/collection/${collection.id}`}>
                  <button type="button" className="btn">
                    Select
                  </button>
                </Link>
              </>
            )}
          </>
        }
      </div>
    </Layout>
  );
};

export default Place;
