import React, { useEffect } from 'react';
import axios from 'axios';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import Collection from '../Collection/Collection';
import Loader from '../Loader/Loader';

import './styles.css';

const collectionsState = atom({
  key: 'collectionsState',
  default: [],
});

const CollectionList = () => {
  const [collections, setCollections] = useRecoilState(collectionsState);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get('/api/collections', {});
      console.log('response', response)
      setCollections(response.data.collections)
    }
    fetch()
  }, []);

  const isLoading = false
  return (
    <div className="collection-list">
      <h2>Collections:</h2>
      {/*error && <div className="error-center">{error}</div>*/}
      <div className="list">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {collections.map((collection, index) => {
              return <Collection key={index} collection={collection} />;
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionList
