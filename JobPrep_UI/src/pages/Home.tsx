import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/authapi";
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  useToast,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  IconButton,
  HStack,
  Spacer,
  InputGroup,
  InputLeftElement,
  Tag,
  Skeleton,
  SkeletonText,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Fade,
  ScaleFade,
  Container,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AddIcon, DeleteIcon, ChatIcon, SearchIcon } from "@chakra-ui/icons";

interface Role {
  id: string;
  position: string;
  description: string;
}

export const Home = () => {
  const { logout } = useContext(AuthContext);
  const [roles, setRoles] = useState<Role[]>([]);
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/role");
      setRoles(res.data.data || []);
    } catch {
      toast({
        title: "Error fetching roles",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    if (!position || !description) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    try {
      setIsCreating(true);
      await api.post("/role", { position, description });
      toast({
        title: "Role created successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setPosition("");
      setDescription("");
      fetchRoles();
    } catch {
      toast({
        title: "Error creating role",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const askDeleteRole = (id: string) => {
    setRoleToDelete(id);
    onOpen();
  };

  const confirmDeleteRole = async () => {
    if (!roleToDelete) return;
    try {
      await api.delete(`/role/${roleToDelete}`);
      toast({
        title: "Role deleted",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      fetchRoles();
    } catch {
      toast({
        title: "Error deleting role",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRoleToDelete(null);
      onClose();
    }
  };

  const filteredRoles = useMemo(() => {
    if (!search.trim()) return roles;
    const q = search.toLowerCase();
    return roles.filter(
      (r) => r.position.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }, [roles, search]);

  return (
    <Box
      minH="100vh"
      w="100%"
      bgGradient="linear(to-br, #0f172a, #1e293b, #334155)"
      position="relative"
      overflow="hidden"
    >
      {/* Animated Background Elements */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="500px"
        h="500px"
        borderRadius="full"
        bgGradient="radial(circle, rgba(56, 189, 248, 0.15), transparent 70%)"
        filter="blur(60px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="600px"
        h="600px"
        borderRadius="full"
        bgGradient="radial(circle, rgba(168, 85, 247, 0.12), transparent 70%)"
        filter="blur(80px)"
        pointerEvents="none"
      />

      <Container maxW="1400px" py={8} px={6} position="relative" zIndex={1}>
        {/* Header */}
        <Fade in={true}>
          <Card
            bg="rgba(30, 41, 59, 0.6)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(148, 163, 184, 0.1)"
            borderRadius="2xl"
            mb={8}
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          >
            <HStack p={6} spacing={4}>
              <Box>
                <Heading 
                  size="lg" 
                  bgGradient="linear(to-r, cyan.300, purple.400)" 
                  bgClip="text"
                  letterSpacing="tight"
                >
                  JobPrep AI
                </Heading>
                <Text color="gray.400" fontSize="sm" mt={1}>
                  Manage roles and launch AI-powered interviews
                </Text>
              </Box>
              <Spacer />
              <Button
                variant="ghost"
                colorScheme="red"
                onClick={logout}
                _hover={{ bg: "rgba(239, 68, 68, 0.1)", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                Logout
              </Button>
            </HStack>
          </Card>
        </Fade>

        {/* Add Role Form */}
        <ScaleFade in={true} initialScale={0.9}>
          <Card
            w="100%"
            maxW="700px"
            mx="auto"
            p={8}
            borderRadius="2xl"
            bg="rgba(30, 41, 59, 0.6)"
            backdropFilter="blur(20px)"
            mb={10}
            boxShadow="0 12px 40px rgba(0, 0, 0, 0.4)"
            border="1px solid rgba(148, 163, 184, 0.1)"
            _hover={{ transform: "translateY(-4px)", boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5)" }}
            transition="all 0.3s ease"
          >
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Heading 
                  size="md" 
                  bgGradient="linear(to-r, cyan.400, teal.400)" 
                  bgClip="text"
                  mb={2}
                >
                  Create New Role
                </Heading>
                <Text color="gray.400" fontSize="sm">
                  Define a position and start interviewing candidates
                </Text>
              </Box>

              <Divider borderColor="rgba(148, 163, 184, 0.2)" />

              <FormControl>
                <FormLabel color="gray.300" fontWeight="medium">Position Title</FormLabel>
                <Input
                  placeholder="e.g., Senior Frontend Developer"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  bg="rgba(15, 23, 42, 0.5)"
                  border="1px solid rgba(148, 163, 184, 0.2)"
                  _hover={{ borderColor: "cyan.500" }}
                  _focus={{ 
                    borderColor: "cyan.400", 
                    boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.4)",
                    bg: "rgba(15, 23, 42, 0.7)"
                  }}
                  color="white"
                  size="lg"
                  transition="all 0.2s"
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300" fontWeight="medium">Description</FormLabel>
                <Input
                  placeholder="e.g., Expert in React, TypeScript, and modern web technologies"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  bg="rgba(15, 23, 42, 0.5)"
                  border="1px solid rgba(148, 163, 184, 0.2)"
                  _hover={{ borderColor: "cyan.500" }}
                  _focus={{ 
                    borderColor: "cyan.400", 
                    boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.4)",
                    bg: "rgba(15, 23, 42, 0.7)"
                  }}
                  color="white"
                  size="lg"
                  transition="all 0.2s"
                />
              </FormControl>

              <Button
                colorScheme="cyan"
                size="lg"
                leftIcon={<AddIcon />}
                onClick={handleAddRole}
                isLoading={isCreating}
                loadingText="Creating..."
                bgGradient="linear(to-r, cyan.500, teal.500)"
                _hover={{ bgGradient: "linear(to-r, cyan.600, teal.600)", transform: "translateY(-2px)" }}
                _active={{ transform: "translateY(0)" }}
                boxShadow="0 4px 20px rgba(34, 211, 238, 0.3)"
                transition="all 0.2s"
              >
                Create Role
              </Button>
            </VStack>
          </Card>
        </ScaleFade>

        {/* Search and Filter */}
        <Fade in={true}>
          <HStack mb={6} spacing={4}>
            <InputGroup size="lg" flex={1}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.500" />
              </InputLeftElement>
              <Input
                placeholder="Search roles by position or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="rgba(30, 41, 59, 0.6)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(148, 163, 184, 0.1)"
                _hover={{ borderColor: "cyan.500" }}
                _focus={{ 
                  borderColor: "cyan.400", 
                  boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.4)" 
                }}
                color="white"
                _placeholder={{ color: "gray.500" }}
              />
            </InputGroup>
            <Tag 
              size="lg" 
              bgGradient="linear(to-r, cyan.500, teal.500)" 
              color="white"
              px={6}
              py={3}
              borderRadius="xl"
              fontWeight="bold"
              boxShadow="0 4px 12px rgba(34, 211, 238, 0.2)"
            >
              {filteredRoles.length} {filteredRoles.length === 1 ? 'role' : 'roles'}
            </Tag>
          </HStack>
        </Fade>

        {/* Roles Grid */}
        {isLoading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card 
                key={i} 
                p={6} 
                borderRadius="2xl" 
                bg="rgba(30, 41, 59, 0.6)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(148, 163, 184, 0.1)"
              >
                <Skeleton height="24px" width="70%" mb={4} startColor="gray.700" endColor="gray.600" />
                <SkeletonText mt="4" noOfLines={3} spacing="3" skeletonHeight="3" startColor="gray.700" endColor="gray.600" />
                <HStack mt={6} justify="space-between">
                  <Skeleton height="40px" width="100px" startColor="gray.700" endColor="gray.600" />
                  <Skeleton height="40px" width="40px" borderRadius="md" startColor="gray.700" endColor="gray.600" />
                </HStack>
              </Card>
            ))}
          </SimpleGrid>
        ) : filteredRoles.length === 0 ? (
          <Fade in={true}>
            <Card 
              bg="rgba(30, 41, 59, 0.6)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(148, 163, 184, 0.1)"
              borderRadius="2xl" 
              p={12} 
              textAlign="center"
            >
              <Heading 
                size="md" 
                bgGradient="linear(to-r, cyan.400, teal.400)" 
                bgClip="text"
                mb={3}
              >
                No roles found
              </Heading>
              <Text color="gray.400">
                {search ? "Try adjusting your search terms" : "Create your first role to get started"}
              </Text>
            </Card>
          </Fade>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredRoles.map((role, index) => (
              <ScaleFade key={role.id} in={true} initialScale={0.8} delay={index * 0.05}>
                <Card
                  p={6}
                  borderRadius="2xl"
                  bg="rgba(30, 41, 59, 0.6)"
                  backdropFilter="blur(20px)"
                  border="1px solid rgba(148, 163, 184, 0.1)"
                  boxShadow="0 4px 20px rgba(0, 0, 0, 0.2)"
                  _hover={{ 
                    transform: "translateY(-8px)", 
                    boxShadow: "0 12px 40px rgba(34, 211, 238, 0.3)",
                    borderColor: "rgba(34, 211, 238, 0.3)"
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  cursor="pointer"
                >
                  <CardHeader p={0} mb={4}>
                    <Heading 
                      size="md" 
                      bgGradient="linear(to-r, cyan.300, teal.300)" 
                      bgClip="text"
                      noOfLines={1}
                    >
                      {role.position}
                    </Heading>
                  </CardHeader>
                  
                  <Divider borderColor="rgba(148, 163, 184, 0.2)" mb={4} />
                  
                  <CardBody p={0} mb={4}>
                    <Text color="gray.300" fontSize="sm" noOfLines={3} lineHeight="1.6">
                      {role.description}
                    </Text>
                  </CardBody>
                  
                  <CardFooter p={0} justify="space-between">
                    <Button
                      leftIcon={<ChatIcon />}
                      bgGradient="linear(to-r, cyan.500, teal.500)"
                      color="white"
                      size="md"
                      onClick={() => navigate(`/interview/${role.id}`)}
                      _hover={{ 
                        bgGradient: "linear(to-r, cyan.600, teal.600)",
                        transform: "scale(1.05)"
                      }}
                      _active={{ transform: "scale(0.98)" }}
                      transition="all 0.2s"
                      boxShadow="0 2px 12px rgba(34, 211, 238, 0.3)"
                    >
                      Start Interview
                    </Button>
                    <IconButton
                      aria-label="Delete role"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      size="md"
                      onClick={() => askDeleteRole(role.id)}
                      _hover={{ bg: "rgba(239, 68, 68, 0.1)", transform: "scale(1.1)" }}
                      transition="all 0.2s"
                    />
                  </CardFooter>
                </Card>
              </ScaleFade>
            ))}
          </SimpleGrid>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setRoleToDelete(null);
          onClose();
        }}
        isCentered
      >
        <AlertDialogOverlay bg="rgba(0, 0, 0, 0.7)" backdropFilter="blur(4px)">
          <AlertDialogContent 
            bg="rgba(30, 41, 59, 0.95)"
            backdropFilter="blur(20px)"
            color="white" 
            border="1px solid rgba(148, 163, 184, 0.2)"
            borderRadius="2xl"
            boxShadow="0 20px 60px rgba(0, 0, 0, 0.5)"
          >
            <AlertDialogHeader 
              fontSize="xl" 
              fontWeight="bold" 
              bgGradient="linear(to-r, red.400, pink.400)" 
              bgClip="text"
            >
              Delete Role
            </AlertDialogHeader>
            <AlertDialogBody color="gray.300" fontSize="md">
              Are you sure? This action cannot be undone and all associated data will be permanently removed.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button 
                ref={cancelRef} 
                onClick={onClose} 
                variant="ghost"
                _hover={{ bg: "rgba(148, 163, 184, 0.1)" }}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={confirmDeleteRole} 
                ml={3}
                bgGradient="linear(to-r, red.500, pink.500)"
                _hover={{ bgGradient: "linear(to-r, red.600, pink.600)" }}
                boxShadow="0 4px 12px rgba(239, 68, 68, 0.3)"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};