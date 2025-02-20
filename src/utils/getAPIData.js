export const getAPIData = async (url, token) => {
    let JsonResult = await fetch(`${process.env.REACT_APP_API}${url}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        }
    });
    let result = await JsonResult.json();
    if (JsonResult.ok && JsonResult.status === 200) {
        return ({
            data: result,
            status: JsonResult.status,
            error: false
        })
    } else {
        return ({
            data: result,
            status: JsonResult.status,
            error: true
        })
    }
}

export const postAPIData = async (url, data, token) => {
    let JsonResult = await fetch(`${process.env.REACT_APP_API}${url}`, {
        method: 'POST',
        headers: token ? data instanceof FormData ? {
            "Authorization": `Bearer ${token}`,
        } : {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        } : {
            "Content-Type": 'application/json'
        },
        body: data ? data instanceof FormData ? data : JSON.stringify(data) : null
    });
    let result = await JsonResult.json();
    if (JsonResult.ok && (JsonResult.status === 200 || JsonResult.status === 201)) {
        return ({
            data: result,
            status: JsonResult.status,
            error: false
        })
    } else {
        return ({
            data: result,
            status: JsonResult.status,
            error: true
        })
    }
}