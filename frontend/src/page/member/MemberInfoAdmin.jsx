import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Lobby from "../Lobby.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faSquareEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export function MemberInfoAdmin() {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [post, setPost] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/member/${memberId}`)
      .then((res) => {
        setMember(res.data.member);
        setProfile(res.data.profile);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/api/post/myList?memberId=${memberId}`)
      .then((res) => {
        setPost(res.data.post);
      })
      .catch();
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Box w={720}>
      <Card w={720} mb={20} boxShadow={"2xl"}>
        <CardBody>
          <Flex>
            <Flex>
              <Avatar
                name="defaultProfile"
                src={profile.src}
                w="100px"
                h="100px"
              />
            </Flex>
            <Flex
              pl={"2rem"}
              w={"100%"}
              flexDirection="column"
              justifyContent="center"
            >
              <Text fontSize="25px">{member.nickName}</Text>
              <Text>123</Text>
            </Flex>
          </Flex>
        </CardBody>
        <Box>
          <Divider />
        </Box>
        <CardFooter>
          <Tabs w="100%" variant="soft-rounded" colorScheme="green">
            <TabList mb={5}>
              <Tab>게시물</Tab>
              <Tab>좋아요</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {post.map((post) => (
                  <Box key={post.postId} mb={9}>
                    <Flex w={"100%"} justify={"space-between"}>
                      <Flex
                        fontWeight={"bolder"}
                        onClick={() => navigate(`/post/${post.postId}`)}
                        cursor={"pointer"}
                      >
                        {post.title}
                      </Flex>
                      <Flex>{post.createDate}</Flex>
                    </Flex>
                    <Divider />
                  </Box>
                ))}
              </TabPanel>
              <TabPanel>2</TabPanel>
            </TabPanels>
          </Tabs>
        </CardFooter>
      </Card>
    </Box>
  );
}

export default MemberInfoAdmin;
