import React, { useEffect, useState } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
} from '@chakra-ui/react';
import './Accidents.css';
import axios from 'axios';
import moment from 'moment';
import { Button } from '@chakra-ui/react';
import img from '../crash.png';
import { Redirect } from 'react-router-dom';



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
                    setData(response?.data?.filter(e => e?.status === "onhold"));
                });
        }
        getAccidents();
    }, [reload]);

    const show = index => {
        data[index].status = 'confirmed'
        axios
            .post(
                'https://roadsafeazurefuncs20210609092106.azurewebsites.net/api/PutDangerTrigger',
                data[index]
            )
            .then(res => {
                setReload(!reload);
            });
    };

    if (!passedDown) {
        return <Redirect to="/" />
    }

    return (
        <div className="wrapper">
            {data?.length === 0 ? <Text fontSize="4xl">No Pending Alerts</Text> :
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Type</Th>
                            <Th>Comment</Th>
                            <Th>Image</Th>
                            <Th>Status</Th>
                            <Th>Time</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((e, index) => (
                            <Tr key={index}>
                                <Td>
                                    {e?.category?.name
                                        ?.split(' ')
                                        .map(e => e.charAt(0).toUpperCase() + e.substring(1))
                                        .join(' ')}
                                </Td>
                                <Td>{e?.comment}</Td>
                                <Td>
                                    {/* <img src={e?.liveImage} alt="Crash" /> */}
                                    <img src={img} width="100px" height="100px" alt="crash img" />
                                </Td>
                                <Td>
                                    <Text color={e?.status === 'confirmed' ? '#4BB543' : '#FF0000'}>
                                        {e?.status?.charAt(0).toUpperCase() + e?.status?.substring(1)}
                                    </Text>
                                </Td>
                                <Td>{moment(e?.time).format('MMMM Do YYYY, h:mm:ss a')}</Td>
                                <Td>
                                    <Button
                                        colorScheme="green"
                                        onClick={() => show(index)}
                                    >
                                        Show
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>}
        </div>
    );
}