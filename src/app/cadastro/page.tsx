'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Textarea,
  useToast,
  VStack,
  Text,
  Badge,
  HStack,
  Icon,
  Tooltip,
} from '@chakra-ui/react'
import { z } from 'zod'
import axios from 'axios'
import { FiCheckCircle, FiAlertCircle, FiLock, FiSearch } from 'react-icons/fi'

// Esquema de validação com Zod
const influencerSchema = z.object({
  fullName: z.string().min(3, 'O nome completo é obrigatório.'),
  instagram: z
    .string()
    .startsWith('@', 'O Instagram deve começar com @.')
    .min(2, 'O @instagram é obrigatório.')
    .refine((val) => !/\s/.test(val), 'O Instagram não pode conter espaços.'),
  bio: z.string().optional().nullable(),
  followers: z.number().optional().nullable(),
  profilePicUrl: z.string().optional().nullable(),
  profile: z.array(z.string()).or(z.string()).optional().nullable(),
  notes: z.string().optional().nullable(),
})

type InfluencerForm = z.infer<typeof influencerSchema>

interface ScrapeStatus {
  success: boolean
  message: string
  isPrivate?: boolean
}

export default function CadastroPage() {
  const [formData, setFormData] = useState<Partial<InfluencerForm>>({})
  const [errors, setErrors] = useState<Partial<Record<keyof InfluencerForm, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isScraping, setIsScraping] = useState(false)
  const [scrapeStatus, setScrapeStatus] = useState<ScrapeStatus | null>(null)
  const toast = useToast()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isCached, setIsCached] = useState(false);

  const handleReset = () => {
    setFormData({})
    setScrapeStatus(null)
    const form = document.querySelector('form')
    if (form) form.reset()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Tratamento especial para o campo instagram
    if (name === 'instagram') {
      // Remove @ do início (se houver) e adiciona um novo
      const cleanValue = value.replace(/^@+/, '')
      const formattedValue = cleanValue ? `@${cleanValue}` : value
      setFormData((prev) => ({ ...prev, [name]: formattedValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (errors[name as keyof InfluencerForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSearch = async () => {
    if (!formData.instagram || formData.instagram.length <= 1) {
      toast({
        title: 'Erro',
        description: 'Digite um @ válido para buscar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsScraping(true)
    setScrapeStatus(null)

    try {
      // Remove o @ antes de enviar para o backend
      const username = formData.instagram.replace(/^@+/, '')
      
      const response = await axios.post('http://localhost:3001/scrape', {
        username
      })

      const { profile_pic_url, biography, followers, name, is_private } = response.data
      
      setFormData((prev) => ({
        ...prev,
        fullName: name || prev.fullName,
        profilePicUrl: profile_pic_url,
        bio: biography,
        followers: followers ? Number(followers) : undefined,
      }))

      setScrapeStatus({
        success: true,
        message: 'Dados obtidos com sucesso!',
        isPrivate: is_private
      })

    } catch (error) {
      setScrapeStatus({
        success: false,
        message: axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Não foi possível obter os dados do perfil.',
      })
      console.error('Erro ao buscar dados:', error)
    } finally {
      setIsScraping(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.instagram) {
      toast({
        title: 'Erro',
        description: 'Digite um @ válido para cadastrar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setLoading(true);
    setError(null);
    
    try {
      // Preparar os dados para envio
      const dataToSend = {
        fullName: formData.fullName || '',
        instagram: formData.instagram,
        followers: formData.followers || null,
        bio: formData.bio || null,
        profilePicUrl: formData.profilePicUrl || null,
        profile: formData.profile ? formData.profile.split(',').map(tag => tag.trim()) : null,
        notes: formData.notes || null
      };

      console.log('Dados a serem enviados:', dataToSend);

      // Validar os dados com Zod
      const validatedData = influencerSchema.parse(dataToSend);
      
      // Enviar para a API
      const response = await axios.post('http://localhost:3001/influencers', validatedData);
      
      if (response.data) {
        toast({
          title: 'Sucesso!',
          description: 'Influenciadora cadastrada com sucesso!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Limpar o formulário
        handleReset();
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Erro de validação
        const errorMessages = err.errors.map(e => e.message).join(', ');
        setError(errorMessages);
        toast({
          title: 'Erro de validação',
          description: errorMessages,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Erro da API
        const errorMsg = axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Erro ao cadastrar influenciadora';
        setError(errorMsg);
        toast({
          title: 'Erro',
          description: errorMsg,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <Heading as="h1" mb={8} textAlign="center">
        Cadastro de Influenciadora
      </Heading>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired isInvalid={!!errors.instagram}>
            <FormLabel fontSize="lg" fontWeight="bold">@Instagram da Influenciadora</FormLabel>
            <InputGroup size="lg">
              <Input
                name="instagram"
                placeholder="Ex: @ana.silva"
                onChange={handleChange}
                value={formData.instagram || ''}
                fontSize="lg"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleSearch}
                  isLoading={isScraping}
                  variant="ghost"
                  colorScheme="blue"
                >
                  <Icon as={FiSearch} />
                </Button>
              </InputRightElement>
            </InputGroup>
            {scrapeStatus && (
              <Box mt={2}>
                <HStack>
                  <Icon
                    as={scrapeStatus.success ? FiCheckCircle : FiAlertCircle}
                    color={scrapeStatus.success ? 'green.500' : 'red.500'}
                  />
                  <Text color={scrapeStatus.success ? 'green.500' : 'red.500'} fontSize="sm">
                    {scrapeStatus.message}
                  </Text>
                  {scrapeStatus.isPrivate && (
                    <Tooltip label="Este é um perfil privado. Algumas informações podem não estar disponíveis.">
                      <span>
                        <Icon as={FiLock} color="orange.500" />
                      </span>
                    </Tooltip>
                  )}
                </HStack>
              </Box>
            )}
          </FormControl>

          {/* Perfil encontrado - Exibe foto e informações */}
          {scrapeStatus?.success && (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              bg="white"
              shadow="sm"
              mb={6}
            >
              <HStack spacing={6} align="start">
                {formData.profilePicUrl && (
                  <Avatar
                    size="2xl"
                    src={formData.profilePicUrl}
                    name={formData.fullName}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                )}
                <VStack align="start" flex={1} spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                      Nome no Instagram
                    </Text>
                    <Text fontSize="lg" fontWeight="bold">
                      {formData.fullName}
                    </Text>
                  </Box>
                  
                  {formData.followers !== undefined && (
                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        Seguidores
                      </Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {formData.followers.toLocaleString('pt-BR')}
                      </Text>
                    </Box>
                  )}

                  {formData.bio && (
                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        Biografia
                      </Text>
                      <Text whiteSpace="pre-wrap">{formData.bio}</Text>
                    </Box>
                  )}
                </VStack>
              </HStack>
            </Box>
          )}

          <FormControl isRequired isInvalid={!!errors.fullName}>
            <FormLabel>Nome Completo</FormLabel>
            <Input
              name="fullName"
              placeholder="Nome completo da influenciadora"
              onChange={handleChange}
              value={formData.fullName || ''}
            />
            <FormErrorMessage>{errors.fullName}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Perfil/Nicho</FormLabel>
            <Input
              name="profile"
              placeholder="Ex: Moda, Lifestyle, Beleza"
              onChange={handleChange}
              value={formData.profile || ''}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Anotações</FormLabel>
            <Textarea
              name="notes"
              placeholder="Observações adicionais..."
              onChange={handleChange}
              value={formData.notes || ''}
              rows={4}
            />
          </FormControl>

          <Button
            colorScheme="blue"
            size="lg"
            type="submit"
            isLoading={isLoading}
            loadingText="Salvando..."
          >
            Cadastrar Influenciadora
          </Button>
        </VStack>
      </Box>

      {profileData && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Dados do Perfil</h3>
          {isCached && (
            <p className="text-sm text-gray-500 mb-2">
              Dados em cache de {new Date(profileData.cachedAt).toLocaleString('pt-BR')}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            {/* ... existing code ... */}
          </div>
        </div>
      )}
    </Container>
  )
} 