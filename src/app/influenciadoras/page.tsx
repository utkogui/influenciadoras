'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Icon,
  Divider,
  Flex,
  Avatar,
  AvatarBadge,
  Tooltip,
  Link,
} from '@chakra-ui/react'
import { FiUsers, FiTag, FiCalendar, FiInstagram } from 'react-icons/fi'

interface Influencer {
  id: number
  full_name: string
  instagram: string
  followers: number
  bio: string
  profile_pic_url: string
  profile_tags: string[]
  notes: string
  created_at: string
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const tagBg = useColorModeValue('blue.50', 'blue.900')

  useEffect(() => {
    fetch('http://localhost:3001/influencers')
      .then((res) => res.json())
      .then(setInfluencers)
      .catch(console.error)
  }, [])

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`
    }
    if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`
    }
    return followers.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8} textAlign="center">
        Influenciadoras Cadastradas
      </Heading>

      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={6}
      >
        {influencers.map((influencer) => (
          <Box
            key={influencer.id}
            bg={cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
            transition="all 0.2s"
            _hover={{
              transform: 'translateY(-4px)',
              shadow: 'lg',
            }}
          >
            {/* Cabeçalho do Card */}
            <Box position="relative" h="120px" bg="blue.500" />
            
            {/* Avatar e Nome */}
            <Box px={6} pb={6}>
              <Flex direction="column" align="center" mt="-50px">
                <Avatar
                  size="xl"
                  src={influencer.profile_pic_url}
                  name={influencer.full_name}
                  border="4px solid white"
                  mb={2}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                >
                  <AvatarBadge boxSize="1.25em" bg="green.500" />
                </Avatar>
                <VStack spacing={1}>
                  <Heading size="md" textAlign="center">
                    {influencer.full_name}
                  </Heading>
                  <Link
                    href={`https://instagram.com/${influencer.instagram.replace('@', '')}`}
                    isExternal
                    color="blue.500"
                    _hover={{ textDecoration: 'none', color: 'blue.600' }}
                  >
                    <HStack>
                      <Icon as={FiInstagram} />
                      <Text fontSize="sm">
                        {influencer.instagram}
                      </Text>
                    </HStack>
                  </Link>
                </VStack>
              </Flex>

              <Divider my={4} />

              {/* Estatísticas */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                <VStack align="center">
                  <Icon as={FiUsers} color="blue.500" boxSize={5} />
                  <Text fontSize="lg" fontWeight="bold">
                    {formatFollowers(influencer.followers)}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Seguidores
                  </Text>
                </VStack>
                <VStack align="center">
                  <Icon as={FiCalendar} color="blue.500" boxSize={5} />
                  <Text fontSize="sm" fontWeight="bold">
                    {formatDate(influencer.created_at)}
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Cadastro
                  </Text>
                </VStack>
              </Grid>

              {/* Bio */}
              {influencer.bio && (
                <Box mb={4}>
                  <Text
                    fontSize="sm"
                    color={textColor}
                    noOfLines={3}
                    textAlign="center"
                    whiteSpace="pre-wrap"
                  >
                    {influencer.bio}
                  </Text>
                </Box>
              )}

              {/* Tags */}
              {influencer.profile_tags && influencer.profile_tags.length > 0 && (
                <Flex wrap="wrap" justify="center" gap={2}>
                  {influencer.profile_tags.map((tag, index) => (
                    <Badge
                      key={index}
                      bg={tagBg}
                      color="blue.500"
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </Flex>
              )}
            </Box>
          </Box>
        ))}
      </Grid>
    </Container>
  )
} 