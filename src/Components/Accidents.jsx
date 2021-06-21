import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import GoogleMapReact from 'google-map-react';
import './Accidents.css';
import { Text } from '@chakra-ui/react';
import axios from 'axios';
import moment from 'moment';
import { Button } from '@chakra-ui/react';
import MyMarker from './MyMarker';
import img from '../crash.png';

export default function Accidents({ user }) {
  const [data, setData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reload, setReload] = useState(false);
  const [comment, setComment] = useState('');
  const [viewedLat, setViewedLat] = useState();
  const [viewedLong, setViewedLong] = useState();
  const [viewedTitle, setViewedTitle] = useState('');

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

  const toggleHide = index => {
    data[index].status === 'confirmed'
      ? (data[index].status = 'on hold')
      : (data[index].status = 'confirmed');
    axios
      .post(
        'https://roadsafeazurefuncs20210609092106.azurewebsites.net/api/PutDangerTrigger',
        data[index]
      )
      .then(res => {
        console.log(res);
        setReload(!reload);
      });
  };

  return (
    <div className="wrapper">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Category</Th>
            <Th>Comment</Th>
            <Th>Image</Th>
            <Th>Status</Th>
            <Th>Time</Th>
            <Th>Location</Th>
            {user?.name && <Th>Action</Th>}
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
                <img src={img} width="100px" height="100px" />
              </Td>
              <Td>
                <Text color={e?.status === 'confirmed' ? '#4BB543' : '#FF0000'}>
                  {e?.status?.charAt(0).toUpperCase() + e?.status?.substring(1)}
                </Text>
              </Td>
              <Td>{moment(e?.time).format('MMMM Do YYYY, h:mm:ss a')}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    setViewedTitle(e?.category?.name);
                    setViewedLat(e?.location?.latitude);
                    setViewedLong(e?.location?.longitude);
                    onOpen();
                  }}
                >
                  View
                </Button>
              </Td>
              {user?.name && (
                <Td>
                  {e?.status === 'on hold' ? (
                    <Button
                      colorScheme="green"
                      onClick={() => toggleHide(index)}
                    >
                      Show
                    </Button>
                  ) : (
                    <Button colorScheme="red" onClick={() => toggleHide(index)}>
                      Hide
                    </Button>
                  )}
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Map</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="map">
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: 'AIzaSyBjdo9fBDQkkbJrhVs9H2hlFn7thh2hWac',
                  language: 'en',
                }}
                defaultCenter={{
                  lat: viewedLat,
                  lng: viewedLong,
                }}
                defaultZoom={15}
              >
                <MyMarker key={viewedTitle} lat={viewedLat} lng={viewedLong} />
              </GoogleMapReact>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

//AIzaSyBsbmaNJjT8-50FuhtFcC1e02FymHJH4lQ
