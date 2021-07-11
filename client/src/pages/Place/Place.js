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
import CollectionList from '../../components/CollectionList/CollectionList';

import './styles.css';

const Place = () => {
  const { id } = useParams();
  const [place, setPlace] = useState();
  const [showCollections, setShowCollections] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`/api/places/${id}`, {});
      setPlace(response.data.place)
    }
    fetch()
  }, []);

  const handleClickAddToCollections = async (e) => {
    setShowCollections(!showCollections);
  }

  const handleClickConfirmAddToCollections = async (e) => {
    console.log(e.target)
    const response = await axios.post(`/api/collections/add/${e.target.id}/${place.id}`, {});
    console.log(response)
    //setPlace(response.data.place)
  }

  return (
    <Layout>
      <div className="place-page">
        {place &&
          <>
            <h1>Place page</h1>
            <h2>{place.name}</h2>
            <button onClick={handleClickAddToCollections} type="button" className="btn">
              Add to collections
            </button>
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
            {showCollections &&
              <>
                <CollectionList
                  itemComponent={(collection) =>
                    <button id={collection.id} key={collection.id} onClick={handleClickConfirmAddToCollections} type="button" className="btn">
                      Add to this collection
                    </button>
                  } />
              </>
            }
          </>
        }
      </div>
    </Layout>
  );
};

export default Place;
