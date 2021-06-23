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
  Text,
} from '@chakra-ui/react';
import Divider from '@material-ui/core/Divider';

// import GoogleMapReact from 'google-map-react';
import './Accidents.css';
import axios from 'axios';
import moment from 'moment';
import { Button } from '@chakra-ui/react';
// import MyMarker from './MyMarker';
import img from '../crash.png';
import { Redirect } from 'react-router-dom';


export default function Accidents({ passedDown }) {
  const [data, setData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [singleData, setSingleData] = useState()

  // const [reload, setReload] = useState(false);
  // const [comment, setComment] = useState('');
  // const [viewedLat, setViewedLat] = useState();
  // const [viewedLong, setViewedLong] = useState();
  // const [viewedTitle, setViewedTitle] = useState('');

  useEffect(() => {

    async function getAccidents() {
      await axios
        .get(
          'https://roadsafeazurefuncs20210609092106.azurewebsites.net/api/GetDangerTrigger'
        )
        .then(response => {
          setData(response?.data?.sort((a, b) => Date.parse(b?.time) - Date.parse(a?.time)));
          console.log(JSON.stringify(response?.data[9]))
        });
    }
    getAccidents();
  }, []);

  const viewAccident = async (id) => {
    await axios.get(`https://roadsafeazurefuncs20210609092106.azurewebsites.net/api/DangerItem/${id}`).then((res) => {
      setSingleData(res?.data[0])
    })
  }

  // const toggleHide = index => {
  //   data[index].status === 'confirmed'
  //     ? (data[index].status = 'onhold')
  //     : (data[index].status = 'confirmed');
  //   axios
  //     .post(
  //       'https://roadsafeazurefuncs20210609092106.azurewebsites.net/api/PutDangerTrigger',
  //       data[index]
  //     )
  //     .then(res => {
  //       console.log(res);
  //       setReload(!reload);
  //     });
  // };

  if (!passedDown) {
    return <Redirect to="/" />
  }

  return (
    <div className="wrapper">
      {data?.length === 0 ? <Text fontSize="4xl">No Alerts</Text> :
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>Comment</Th>
              <Th>Image</Th>
              <Th>Status</Th>
              <Th>Time</Th>
              {/* <Th>Location</Th> */}
              <Th>More Info</Th>
              {/* <Th>Action</Th> */}
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
                  <img src={e?.liveImage} width="100px" height="50px" alt="Crash" />
                  {/* <img src={img} width="100px" height="100px" alt="crash img" /> */}
                </Td>


                <Td>
                  {e?.status === "inactive" ? <Text color="rgb(104, 104, 104)">
                    {e?.status?.charAt(0).toUpperCase() + e?.status?.substring(1)}
                  </Text> :
                    <Text color={e?.status === 'confirmed' ? '#4BB543' : '#FF0000'}>
                      {e?.status?.charAt(0).toUpperCase() + e?.status?.substring(1)}
                    </Text>}
                </Td>
                <Td>{moment(e?.time).format('MMMM Do YYYY, h:mm:ss a')}</Td>
                {/* <Td>
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
              </Td> */}
                < Td >
                  <Button onClick={() => {
                    onOpen();
                    viewAccident(e?.id)
                  }}>More</Button>

                  <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Accident Info</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Text mb="1rem">
                          <span style={{ "fontWeight": "bolder", fontSize: "16px", letterSpacing: "1px" }}>Category:  </span>{singleData?.category?.name?.split(' ')
                            .map(e => e.charAt(0).toUpperCase() + e.substring(1))
                            .join(' ')}
                        </Text>
                        <Text mb="1rem">
                          <span style={{ "fontWeight": "bolder", fontSize: "16px", letterSpacing: "1px" }}>Comment:  </span>{singleData?.comment}
                        </Text>
                        {singleData?.category?.content?.length && <Text mb="1rem">
                          <span style={{ "fontWeight": "bolder", fontSize: "16px", letterSpacing: "1px" }}>Casualties: {singleData?.category?.content?.length}  </span>{singleData?.category?.content.map((e, key) => (
                            <>
                              <p><span style={{ fontWeight: "bold" }}>Age: </span>{e?.casualtyAge}</p>
                              <p><span style={{ fontWeight: "bold" }}>Gender: </span>{e?.casualtyGender}</p>
                              <p><span style={{ fontWeight: "bold" }}>Profession: </span>{e?.casualtyProfession}</p>
                              <p><span style={{ fontWeight: "bold" }}>Type: </span>{e?.casualtytype}</p>
                              <p><span style={{ fontWeight: "bold" }}>Injury Degree: </span>{e?.injuryDegree}</p>
                              <Divider />
                            </>
                          ))}
                        </Text>}
                        <Text mb="1rem">
                          <span style={{ "fontWeight": "bolder", fontSize: "16px", letterSpacing: "1px" }}>Location:  </span>{`Latitude: ${singleData?.location?.latitude}, Longitude: ${singleData?.location?.longitude}`}
                        </Text>
                        <Text mb="1rem">
                          <span style={{ "fontWeight": "bolder", fontSize: "16px", letterSpacing: "1px" }}>Time:  </span>{moment(e?.time).format('MMMM Do YYYY, h:mm:ss a')}
                        </Text>
                        <Text mb="1rem">
                          <span style={{ "fontWeight": "bolder", fontSize: "16px", letterSpacing: "1px" }}>Status:  </span>{singleData?.status?.split(' ')
                            .map(e => e.charAt(0).toUpperCase() + e.substring(1))
                            .join(' ')}
                        </Text>
                      </ModalBody>

                      <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                          Close
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Td>
                {/* <Td>
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
              </Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table >}

      {/* <Modal isOpen={isOpen} onClose={onClose} size="6xl">
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
      </Modal> */}
    </div >
  );
}

//AIzaSyBsbmaNJjT8-50FuhtFcC1e02FymHJH4lQ
