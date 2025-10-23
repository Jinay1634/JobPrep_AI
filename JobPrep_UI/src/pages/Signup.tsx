import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Text,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Link as ChakraLink,
  Divider,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Fade,
  ScaleFade,
} from "@chakra-ui/react";
import { AtSignIcon, EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/authapi";

type SignUpInput = {
  email: string;
  password: string;
  name: string;
};

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { login, token, user } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>();

  const onSubmit = async (data: SignUpInput) => {
    try {
      const res = await api.post("/createuser", data);

      if (!res.data.token || !res.data.data) {
        toast({
          title: "Signup failed",
          description: "Invalid response from server",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      login(res.data);

      toast({
        title: "Account created 🎉",
        description: "You have successfully signed up",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/home", { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Signup error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong, please try again later";

      toast({
        title: "Signup failed",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (token && user) {
      navigate("/home", { replace: true });
    }
  }, [token, user, navigate]);

  return (
    <Box 
      minH="100vh" 
      w="100%" 
      bgGradient="linear(to-br, #0f172a, #1e293b, #334155)" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      px={4}
      position="relative"
      overflow="hidden"
    >
      {/* Animated Background Elements */}
      <Box
        position="absolute"
        top="15%"
        left="15%"
        w="500px"
        h="500px"
        borderRadius="full"
        bgGradient="radial(circle, rgba(34, 211, 238, 0.15), transparent 70%)"
        filter="blur(80px)"
        pointerEvents="none"
        animation="float 18s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="15%"
        right="15%"
        w="600px"
        h="600px"
        borderRadius="full"
        bgGradient="radial(circle, rgba(168, 85, 247, 0.12), transparent 70%)"
        filter="blur(100px)"
        pointerEvents="none"
        animation="float 22s ease-in-out infinite reverse"
      />

      <ScaleFade in={true} initialScale={0.9}>
        <Card 
          w="100%" 
          maxW="500px" 
          bg="rgba(30, 41, 59, 0.8)"
          backdropFilter="blur(20px)"
          color="white" 
          border="1px solid rgba(148, 163, 184, 0.15)" 
          borderRadius="3xl" 
          boxShadow="0 25px 80px rgba(0, 0, 0, 0.5)"
          overflow="hidden"
        >
          <CardHeader textAlign="center" pt={10} pb={4}>
            <Fade in={true}>
              <Box mb={6}>
                <Box
                  w="80px"
                  h="80px"
                  mx="auto"
                  mb={4}
                  bgGradient="linear(to-br, purple.400, cyan.500)"
                  borderRadius="2xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 8px 32px rgba(168, 85, 247, 0.3)"
                  transform="rotate(5deg)"
                  _hover={{ transform: "rotate(-5deg) scale(1.05)" }}
                  transition="all 0.3s ease"
                >
                  <Text fontSize="3xl" fontWeight="bold">JP</Text>
                </Box>
              </Box>
              <Heading 
                size="xl" 
                bgGradient="linear(to-r, purple.300, cyan.400)" 
                bgClip="text"
                letterSpacing="tight"
                mb={2}
              >
                JobPrep AI
              </Heading>
              <Text color="gray.400" fontSize="md">
                Start your career journey today 🚀
              </Text>
            </Fade>
          </CardHeader>

          <CardBody px={8} pb={10}>
            <Heading 
              mb={6} 
              textAlign="center" 
              size="md" 
              color="gray.200"
              fontWeight="semibold"
            >
              Create your account
            </Heading>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={5} align="stretch">
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel htmlFor="username" color="gray.300" fontWeight="medium">Username</FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <AtSignIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Your username"
                      {...register("name", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                      })}
                      bg="rgba(15, 23, 42, 0.6)"
                      border="1px solid rgba(148, 163, 184, 0.2)"
                      _hover={{ borderColor: "purple.400" }}
                      _focus={{ 
                        borderColor: "purple.400", 
                        boxShadow: "0 0 0 1px rgba(168, 85, 247, 0.5)",
                        bg: "rgba(15, 23, 42, 0.8)"
                      }}
                      transition="all 0.2s"
                    />
                  </InputGroup>
                  <FormErrorMessage color="red.300">{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email" color="gray.300" fontWeight="medium">Email Address</FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <EmailIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      bg="rgba(15, 23, 42, 0.6)"
                      border="1px solid rgba(148, 163, 184, 0.2)"
                      _hover={{ borderColor: "purple.400" }}
                      _focus={{ 
                        borderColor: "purple.400", 
                        boxShadow: "0 0 0 1px rgba(168, 85, 247, 0.5)",
                        bg: "rgba(15, 23, 42, 0.8)"
                      }}
                      transition="all 0.2s"
                    />
                  </InputGroup>
                  <FormErrorMessage color="red.300">{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel htmlFor="password" color="gray.300" fontWeight="medium">Password</FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      bg="rgba(15, 23, 42, 0.6)"
                      border="1px solid rgba(148, 163, 184, 0.2)"
                      _hover={{ borderColor: "purple.400" }}
                      _focus={{ 
                        borderColor: "purple.400", 
                        boxShadow: "0 0 0 1px rgba(168, 85, 247, 0.5)",
                        bg: "rgba(15, 23, 42, 0.8)"
                      }}
                      transition="all 0.2s"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="purple"
                        onClick={() => setShowPassword((prev: boolean) => !prev)}
                        _hover={{ bg: "rgba(168, 85, 247, 0.1)" }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage color="red.300">{errors.password?.message}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  w="full"
                  bgGradient="linear(to-r, purple.500, cyan.500)"
                  color="white"
                  isLoading={isSubmitting}
                  loadingText="Creating account..."
                  _hover={{ 
                    bgGradient: "linear(to-r, purple.600, cyan.600)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 30px rgba(168, 85, 247, 0.4)"
                  }}
                  _active={{ transform: "translateY(0)" }}
                  boxShadow="0 4px 20px rgba(168, 85, 247, 0.3)"
                  transition="all 0.2s"
                  mt={2}
                >
                  Create Account
                </Button>

                <HStack spacing={4} my={2}>
                  <Divider borderColor="rgba(148, 163, 184, 0.2)" />
                  <Text color="gray.500" fontSize="sm" whiteSpace="nowrap">or sign up with</Text>
                  <Divider borderColor="rgba(148, 163, 184, 0.2)" />
                </HStack>

               
                <Text fontSize="sm" textAlign="center" color="gray.400" mt={4}>
                  Already have an account?{" "}
                  <ChakraLink 
                    as={RouterLink} 
                    to="/login" 
                    bgGradient="linear(to-r, purple.400, cyan.400)"
                    bgClip="text"
                    fontWeight="bold"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Log in
                  </ChakraLink>
                </Text>

                <Text fontSize="xs" textAlign="center" color="gray.500" mt={2}>
                  By signing up, you agree to our{" "}
                  <ChakraLink color="purple.400" _hover={{ textDecoration: "underline" }}>
                    Terms of Service
                  </ChakraLink>
                  {" "}and{" "}
                  <ChakraLink color="purple.400" _hover={{ textDecoration: "underline" }}>
                    Privacy Policy
                  </ChakraLink>
                </Text>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </ScaleFade>

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-30px) scale(1.05);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Signup;