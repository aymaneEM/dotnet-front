import { Box, Stack } from '@chakra-ui/react'
import * as React from 'react'
import Copyright from './Copyright'
import logo from "../../narsa.png"
const Footer = () => {
    return (<Box
        as="footer"
        role="contentinfo"
        h="15%"
        mx="auto"

        py="6"
        px={{

            md: '8',
        }}
        bg="#b3b3cc"
    >
        <Stack direction="row" align="center" justify="space-around">
            <img src={logo} alt="" width="180px" />
            <Copyright
                alignSelf={{
                    base: 'center',
                    sm: 'start',
                }}
            />
        </Stack>
    </Box>)
}
export default Footer