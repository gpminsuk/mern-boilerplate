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
import MessageForm from '../../components/MessageForm/MessageForm';
import { reseedDatabase } from '../../store/actions/authActions';

import './styles.css';

const Collection = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState();
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`/api/collections/${id}`, {});
      setCollection(response.data.collection)
    }
    fetch()
  }, []);

  return (
    <Layout>
      <div className="collection-page">
        {collection &&
          <>
            <h1>Collection page</h1>
            <h2>{collection.name}</h2>
            {collection.places.map(place =>
              <>
                <h3>{place.name}</h3>
                <Link to={`/place/${place.id}`}>
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

export default Collection;
