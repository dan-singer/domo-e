
const handleDomo = (e, csrf) => {
    e.preventDefault();
    $("#domoMessage").animate({width:'hide'}, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#squirrelsOwned").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), () => {
        loadDomosFromServer(csrf);
    });
    return false;
};

const deleteDomo = (name, _csrf) => {
    sendAjax('POST', `/deleteDomo?_csrf=${_csrf}`, {name}, () => {
        loadDomosFromServer();
    })
}

const DomoForm = (props) => {

    return (
        <form id="domoForm"
            onSubmit={(e) => { handleDomo(e, props.csrf); } }
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="squirrelsOwned">Squirrels: </label>
            <input id="squirrelsOwned" type="text" name="squirrelsOwned" placeholder="# of Squirrels" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    )
}

const DomoList = (props) => {

    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        )
    }
    const domoNodes = props.domos.map(function(domo){
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoSquirrels"> Squirrels: {domo.squirrelsOwned}</h3>
                <button className="domoSquirrels" onClick={() => deleteDomo(domo.name, props.csrf) }>Delete Domo</button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );

}

const loadDomosFromServer = (csrf) => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} csrf={csrf} />, document.querySelector("#domos")
        );
    })
}

const setup = (csrf) => {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} csrf={csrf} />, document.querySelector("#domos")
    );

    loadDomosFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    }); 
}

$(document).ready(() => {
    getToken();
});