import React from 'react';
import { useSelector } from 'react-redux';

const Error = () => {
    const error = useSelector(store => store.error);

    return (
        <div className={`error ${error ? 'show' : ''}`}>
            <h1>{error}</h1>
        </div>
    )
};

export default Error;