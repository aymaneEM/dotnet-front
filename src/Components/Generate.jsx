import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import axios from "axios";

export default function Accidents({ passedDown }) {
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);
    useEffect(() => {

        async function getAccidents() {
            await axios
                .get(
                    'https://roadsafeazurefuncs20210609092106.azurewebsites.net/api/GetDangerTrigger'
                )
                .then(response => {
                    setData(response?.data);
                });
        }
        getAccidents();
    }, [reload]);

    const columns = ["id", "comment", "time", "status"];


    //let result = flattenObject(data.map(({id,time,category:name,status})=>({id,time,name,status})));
    //console.log(result);

    const options = {
        filterType: 'checkbox',
    };
    let ArrayData = Object.entries(data.map(({ id, category: name, time, status }) => ({ id, category: name, time, status })));
    console.log(ArrayData);
    return (
        <MUIDataTable
            title={"Accident List"}
            data={data.map(({ id, comment, time, status }) => ({ id, comment, time, status }))}
            columns={columns}
            options={options}
        />);

}