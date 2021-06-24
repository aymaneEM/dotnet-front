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
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        maxWidth: "1200px",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


export default function Accidents({ passedDown }) {
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);
    const [image, setImage] = useState()

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {

        async function getAccidents() {
            await axios
                .get(
                    'https://roadsafeazurefuncs20210609092106.azurewebsites.net/api/GetDangerTrigger'
                )
                .then(response => {
                    setData(response?.data?.filter(e => e?.status === "confirmed")?.sort((a, b) => Date.parse(b?.time) - Date.parse(a?.time)));
                });
        }
        getAccidents();
    }, [reload]);

    const hide = index => {
        data[index].status = 'inactive'
        axios
            .post(
                'https://roadsafeazurefuncs20210609092106.azurewebsites.net/api/PutDangerTrigger',
                data[index]
            )
            .then(res => {
                setReload(!reload);
            });
    };

    const viewImage = async (id) => {
        await axios.get(`https://roadsafeazurefuncs20210609092106.azurewebsites.net/api/DangerItem/${id}`).then((res) => {
            setImage(res?.data[0]?.liveImage)
        })
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <img src={image} className="image" alt="Crash" />
            <Modal />
        </div>
    );

    if (!passedDown) {
        return <Redirect to="/" />
    }

    return (
        <div className="wrapper">
            {data?.length === 0 ? <Text fontSize="4xl">No Ongoing Alerts</Text> :
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

                                    <button type="button" onClick={() => { handleOpen(); viewImage(e?.id) }}>
                                        <img src={e?.liveImage} width="100px" height="50px" alt="Crash" />
                                    </button>
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="simple-modal-title"
                                        aria-describedby="simple-modal-description"
                                    >
                                        {body}
                                    </Modal>
                                    {/* <img src={img} width="100px" height="100px" alt="crash img" /> */}
                                </Td>
                                <Td>
                                    <Text color={e?.status === 'confirmed' ? '#4BB543' : '#FF0000'}>
                                        {e?.status?.charAt(0).toUpperCase() + e?.status?.substring(1)}
                                    </Text>
                                </Td>
                                <Td>{moment(e?.time).format('MMMM Do YYYY, h:mm:ss a')}</Td>
                                <Td>
                                    <Button colorScheme="red" onClick={() => hide(index)}>
                                        Set Inactive
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>}
        </div >
    );
}