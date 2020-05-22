import React from 'react';


const AsideTopPost = () => {


    return (
        <div className="card text-white bg-primary mt-3">
            <div className="card-header">TOP - TROP DE TROP</div>
            <div className="card-body">
                <a href="#">les plus trop de trop</a>
                <br/>
                <a href="#">les moins trop de trop</a>
                <br/>
                <a href="#">les plus fou</a>
                <br/>
                <a href="#">les plus flippant</a>
            </div>
        </div>
    );
};

export default React.memo(AsideTopPost);
