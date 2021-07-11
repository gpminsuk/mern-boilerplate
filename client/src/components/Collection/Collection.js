import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

const Collection = ({ collection }) => {
  console.log('d', collection)

  return (
    <div className={'message'}>
      {collection.name}, {collection.places.map(place => place.name)}

      <Link to={`/collection/${collection.id}`}>
        <button type="button" className="btn">
          Select
        </button>
      </Link>
    </div>
  );
};

export default Collection;
