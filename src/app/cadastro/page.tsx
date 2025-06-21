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
import { FiCheckCircle, FiAlertCircle, FiLock } from 'react-icons/fi'

// Esquema de validação com Zod
const influencerSchema = z.object({
  fullName: z.string().min(3, 'O nome completo é obrigatório.'),
  instagram: z
    .string()
    .startsWith('@', 'O Instagram deve começar com @.')
    .min(2, 'O @instagram é obrigatório.')
    .refine((val) => !/\s/.test(val), 'O Instagram não pode conter espaços.'),
  profile: z.string().optional(),
  notes: z.string().optional(),
  bio: z.string().optional(),
  followers: z.number().optional(),
  profilePicUrl: z.string().url().optional(),
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
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleReset = () => {
    setFormData({})
    setScrapeStatus(null)
    const form = document.querySelector('form')
    if (form) form.reset()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof InfluencerForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    // Reset scrape status when instagram changes
    if (name === 'instagram') {
      setScrapeStatus(null)
    }
  }

  // Efeito para acionar o scraping
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    if (formData.instagram && formData.instagram.length > 1 && formData.instagram.startsWith('@')) {
      setIsScraping(true)
      debounceTimeout.current = setTimeout(async () => {
        try {
          const response = await axios.post('http://localhost:3001/scrape', {
            username: formData.instagram,
          })
          const { profilePicUrl, bio, followers, name, isPrivate } = response.data
          
          // Se o nome do Instagram foi encontrado e o nome completo ainda não foi preenchido
          if (name && !formData.fullName) {
            setFormData((prev) => ({
              ...prev,
              fullName: name,
              profilePicUrl,
              bio,
              followers: followers ? Number(followers) : undefined,
            }))
          } else {
            setFormData((prev) => ({
              ...prev,
              profilePicUrl,
              bio,
              followers: followers ? Number(followers) : undefined,
            }))
          }

          setScrapeStatus({
            success: true,
            message: 'Dados obtidos com sucesso!',
            isPrivate
          })

        } catch (error) {
          setScrapeStatus({
            success: false,
            message: axios.isAxiosError(error) && error.response?.data?.error
              ? error.response.data.error
              : 'Não foi possível obter os dados do perfil.',
          })
        } finally {
          setIsScraping(false)
        }
      }, 1000) // Aguarda 1 segundo após o usuário parar de digitar
    } else {
      setIsScraping(false)
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [formData.instagram, formData.fullName, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = influencerSchema.safeParse(formData)

    if (!result.success) {
      const newErrors: Partial<Record<keyof InfluencerForm, string>> = {}
      result.error.errors.forEach((err) => {
        newErrors[err.path[0] as keyof InfluencerForm] = err.message
      })
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Adapta os dados para o formato esperado pelo backend
      const submissionData = {
        fullName: result.data.fullName,
        instagram: result.data.instagram,
        followers: result.data.followers,
        bio: result.data.bio,
        profilePicUrl: result.data.profilePicUrl,
        profile: result.data.profile,
        notes: result.data.notes,
      }

      console.log('Enviando dados:', submissionData) // Log para debug
      
      const response = await axios.post('http://localhost:3001/influencers', submissionData)
      console.log('Resposta do servidor:', response.data) // Log para debug

      toast({
        title: 'Sucesso!',
        description: `Influenciadora ${result.data.fullName} cadastrada.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
      handleReset()
    } catch (error) {
      console.error('Erro completo:', error) // Log para debug
      toast({
        title: 'Erro no cadastro.',
        description:
          axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : 'Não foi possível cadastrar a influenciadora.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.md" py={10}>
      <Heading as="h1" mb={8} textAlign="center">
        Cadastro de Influenciadora
      </Heading>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          {formData.profilePicUrl && (
            <FormControl>
              <Box position="relative" width="fit-content" mx="auto">
                <Avatar 
                  size="2xl" 
                  name={formData.fullName} 
                  src={formData.profilePicUrl}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  icon={
                    <Avatar
                      size="2xl"
                      name={formData.fullName}
                      bg="purple.500"
                    />
                  }
                />
              </Box>
            </FormControl>
          )}

          <FormControl isRequired isInvalid={!!errors.fullName}>
            <FormLabel>Nome completo</FormLabel>
            <Input
              name="fullName"
              placeholder="Ex: Ana Silva"
              onChange={handleChange}
              value={formData.fullName || ''}
            />
            {errors.fullName && <FormErrorMessage>{errors.fullName}</FormErrorMessage>}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.instagram}>
            <FormLabel>@Instagram</FormLabel>
            <InputGroup>
              <Input
                name="instagram"
                placeholder="Ex: @ana.silva"
                onChange={handleChange}
                value={formData.instagram || ''}
              />
              <InputRightElement>
                {isScraping ? (
                  <Spinner size="sm" />
                ) : scrapeStatus && (
                  <Icon
                    as={scrapeStatus.success ? FiCheckCircle : FiAlertCircle}
                    color={scrapeStatus.success ? 'green.500' : 'red.500'}
                  />
                )}
              </InputRightElement>
            </InputGroup>
            {errors.instagram && <FormErrorMessage>{errors.instagram}</FormErrorMessage>}
            {scrapeStatus && (
              <HStack mt={2} spacing={2}>
                <Text fontSize="sm" color={scrapeStatus.success ? 'green.500' : 'red.500'}>
                  {scrapeStatus.message}
                </Text>
                {scrapeStatus.isPrivate && (
                  <Tooltip label="Este é um perfil privado, algumas informações podem não estar disponíveis">
                    <Badge colorScheme="yellow" variant="subtle">
                      <HStack spacing={1}>
                        <Icon as={FiLock} />
                        <Text>Privado</Text>
                      </HStack>
                    </Badge>
                  </Tooltip>
                )}
                {formData.followers && (
                  <Badge colorScheme="purple" variant="subtle">
                    {new Intl.NumberFormat('pt-BR').format(formData.followers)} seguidores
                  </Badge>
                )}
              </HStack>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Textarea
              name="bio"
              placeholder="Bio do Instagram (preenchido automaticamente)"
              value={formData.bio || ''}
              onChange={handleChange}
              isDisabled
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Perfil de atuação (tags)</FormLabel>
            <Input
              name="profile"
              placeholder="Ex: cabelo, maquiagem, moda..."
              onChange={handleChange}
              value={formData.profile || ''}
            />
          </FormControl>

          <FormControl mb={6}>
            <FormLabel>Observações gerais</FormLabel>
            <Textarea
              name="notes"
              placeholder="Informações adicionais..."
              onChange={handleChange}
              value={formData.notes || ''}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="purple"
            width="full"
            size="lg"
            isLoading={isLoading}
          >
            Salvar
          </Button>
        </VStack>
      </Box>
    </Container>
  )
} 