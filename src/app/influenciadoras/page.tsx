'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Avatar,
  Box,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Tag,
  Link,
  Flex,
  Select,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'

interface Influencer {
  id: number
  full_name: string
  instagram: string
  followers: number | null
  bio: string | null
  profile_pic_url: string | null
  profile_tags: string[] | null
  notes: string | null
}

// Função para converter '20.1M' em número - Adaptada para a nova estrutura
const parseFollowers = (followers: number | null): number => {
  return followers || 0
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get('http://localhost:3001/influencers')
        setInfluencers(response.data)
        setError(null)
      } catch (err) {
        setError('Falha ao buscar influenciadoras. Tente novamente mais tarde.')
        toast({
          title: 'Erro de Conexão',
          description: 'Não foi possível carregar os dados do servidor.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchInfluencers()
  }, [toast])

  const filteredAndSortedInfluencers = useMemo(() => {
    let processedInfluencers = [...influencers]

    // Filtro de busca
    if (searchTerm) {
      processedInfluencers = processedInfluencers.filter(
        (influencer) =>
          influencer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          influencer.instagram.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (influencer.profile_tags &&
            influencer.profile_tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      )
    }

    // Ordenação
    if (sortOrder === 'name') {
      processedInfluencers.sort((a, b) => a.full_name.localeCompare(b.full_name))
    } else if (sortOrder === 'followers') {
      processedInfluencers.sort((a, b) => parseFollowers(b.followers) - parseFollowers(a.followers))
    }

    return processedInfluencers
  }, [influencers, searchTerm, sortOrder])

  if (isLoading) {
    return (
      <Container centerContent py={20}>
        <Spinner size="xl" />
        <Text mt={4}>Carregando influenciadoras...</Text>
      </Container>
    )
  }

  if (error) {
    return (
      <Container centerContent py={20}>
        <Heading color="red.500">Erro</Heading>
        <Text mt={4}>{error}</Text>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8}>
        <Heading as="h1">Visualização de Influenciadoras</Heading>

        <Flex direction={{ base: 'column', md: 'row' }} w="full" gap={4}>
          <Input
            placeholder="Buscar por nome, @ ou tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Ordenar por..."
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="name">Nome</option>
            <option value="followers">Número de seguidores</option>
          </Select>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
          {filteredAndSortedInfluencers.map((influencer) => (
            <Link
              key={influencer.id}
              href={`https://instagram.com/${influencer.instagram.substring(1)}`}
              isExternal
              _hover={{ textDecoration: 'none' }}
              w="full"
            >
              <Box
                borderWidth="1px"
                borderRadius="lg"
                p={6}
                transition="all 0.2s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  borderColor: 'purple.200'
                }}
              >
                <VStack spacing={4} align="center" textAlign="center">
                  <Avatar 
                    size="2xl" 
                    name={influencer.full_name} 
                    src={influencer.profile_pic_url || undefined}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  <VStack spacing={1}>
                    <Heading as="h3" size="md">
                      {influencer.full_name}
                    </Heading>
                    <Text color="purple.500">
                      {influencer.instagram}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {influencer.followers ? `${(influencer.followers / 1000000).toFixed(1)}M seguidores` : 'N/A'}
                    </Text>
                  </VStack>
                  
                  {influencer.bio && (
                    <Text 
                      fontSize="sm" 
                      color="gray.600"
                      noOfLines={3}
                      h="4.5em"
                      overflow="hidden"
                    >
                      {influencer.bio}
                    </Text>
                  )}

                  <HStack spacing={2} wrap="wrap" justify="center">
                    {influencer.profile_tags && influencer.profile_tags.map((tag) => (
                      <Tag key={tag} size="sm" colorScheme="purple">
                        {tag}
                      </Tag>
                    ))}
                  </HStack>
                </VStack>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  )
} 