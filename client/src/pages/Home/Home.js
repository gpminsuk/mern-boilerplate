import React, { useState } from 'react';
import axios from 'axios';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Layout from '../../layout/Layout';
import CollectionList from '../../components/CollectionList/CollectionList';
import MessageForm from '../../components/MessageForm/MessageForm';
import { reseedDatabase } from '../../store/actions/authActions';
import Collection from '../../components/Collection/Collection';

import './styles.css';

const ReseedMessage = ({ handleReseed }) => {
  return (
    <div>
      <span style={{ marginRight: '10px' }}>
        If the app has been vandalized just reseed the database by clicking this button
      </span>
      <button onClick={handleReseed} className="btn reseed-btn">
        Reseed Database
      </button>
    </div>
  );
};

let latestRequest = null;

const Home = ({ auth, reseedDatabase }) => {
  const handleReseed = () => {
    reseedDatabase();
  };
  const [results, setResults] = useState([]);

  const onChange = async (e) => {
    const query = e.target.value;
    latestRequest = query;
    if (query) {
      const response = await axios.post(
        'https://i-o-optimized-deployment-8a14a8.ent.westus2.azure.elastic-cloud.com/api/as/v1/engines/mm2b-search-engine/search.json',
        JSON.stringify({
          query,
        }),
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: 'Bearer search-2e45zmttpfnywx5j7tdkckck',
          },
        },
      );
      if (latestRequest === query) {
        setResults(response.data.results);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <Layout>
      <div className="home-page">
        <h1>Home page</h1>
        <iframe src="https://mm2b.azurewebsites.net/three"></iframe>
        Search: <input type="text" name="name" onChange={onChange} />
        {results.map((item) => (
          <>
            <div>
              {item.name.raw}: {item.address.raw}
            </div>
          </>
        ))}
        {!auth.isAuthenticated ? (
          <div>
            <p>
              Welcome guest!{' '}
              <Link className="bold" to="/login">
                Log in
              </Link>{' '}
              or{' '}
              <Link className="bold" to="/register">
                Register
              </Link>
            </p>
            <ReseedMessage handleReseed={handleReseed} />
          </div>
        ) : (
          <>
            <p>
              Welcome <span className="name">{auth.me.name}</span>!
            </p>
            <ReseedMessage handleReseed={handleReseed} />
            <MessageForm />
          </>
        )}
        <CollectionList
          itemComponent={(collection) => <Collection key={collection.id} collection={collection} />}
        />
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { reseedDatabase }))(Home);
