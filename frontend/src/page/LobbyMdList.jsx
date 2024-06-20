import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";

export function LobbyMdList() {
  return (
    <>
      <Center>
        <FontAwesomeIcon icon={faArrowLeft} fontSize="2rem" />
        <Card
          direction={{ base: "column", sm: "row" }}
          overflow="hidden"
          variant="outline"
          maxW="50%"
          justifyContent="center"
        >
          <Image
            objectFit="cover"
            maxW={{ base: "100%", sm: "200px" }}
            src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
            alt="Caffe Latte"
          />
          <Stack>
            <CardBody>
              <Heading size="md">The perfect latte</Heading>
              <Text py="2">
                Caffè latte is a coffee beverage of Italian origin made with
                espresso and steamed milk.
              </Text>
            </CardBody>

            <CardFooter>
              <Button variant="solid" colorScheme="blue">
                Buy Latte
              </Button>
            </CardFooter>
          </Stack>
        </Card>
        <FontAwesomeIcon icon={faArrowRight} fontSize="2rem" />
      </Center>
    </>
  );
}
