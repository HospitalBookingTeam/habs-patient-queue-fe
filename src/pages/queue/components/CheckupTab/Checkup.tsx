import { Autocomplete, Stack, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AutocompleteOption } from '../../../../entities/base'
import { CheckupRecordData } from '../../../../entities/record'
import apiHelper from '../../../../utils/apiHelper'

const Checkup = ({
  isSave,
  data,
  icdList,
}: {
  isSave: boolean
  data?: CheckupRecordData
  icdList?: AutocompleteOption[]
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      bloodPressure: 0,
      temperature: 0,
      pulse: 0,
      doctorAdvice: '',
      diagnosis: '',
    },
  })

  const [icdDisease, setIcdDisease] = useState<AutocompleteOption | null>(null)

  useEffect(() => {
    if (!data) return
    const option = icdList?.find((op) => op.value === data.icdDiseaseId)
    setIcdDisease(!!option ? option : null)
  }, [data])

  const handleUpdateCheckupRecord = useCallback(
    async (values: any) => {
      const {
        bloodPressure,
        pulse,
        temperature,
        doctorAdvice,
        diagnosis,
      }: CheckupRecordData = values
      try {
        await apiHelper.put(`checkup-records/${data?.id}`, {
          bloodPressure,
          pulse,
          temperature,
          doctorAdvice,
          diagnosis,
          id: data?.id,
          patientId: data?.patientId,
          icdDiseaseId: icdDisease?.value,
        })
      } catch (err) {
        console.log(err)
      }
    },
    [data, icdDisease]
  )

  useEffect(() => {
    reset(
      {
        ...data,
      },
      { keepDirty: true }
    )
  }, [data])

  useEffect(() => {
    if (!isSave) return
    handleSubmit(handleUpdateCheckupRecord)()
  }, [isSave])

  return (
    <form onSubmit={handleSubmit(handleUpdateCheckupRecord)}>
      <Stack spacing={4} mb={4}>
        <Stack direction="row" flex={'1 1 auto'} spacing={4}>
          <TextField
            label="Nhịp tim"
            type="number"
            {...register('bloodPressure', {})}
          />
          <TextField
            label="Huyết áp"
            type="number"
            {...register('pulse', {})}
          />
          <TextField
            label="Nhiệt độ"
            type="number"
            {...register('temperature', {})}
          />
        </Stack>

        <Autocomplete
          value={icdDisease}
          onChange={(_, value) => { setIcdDisease(value) }}
          options={icdList ?? []}
          sx={{ width: '100%' }}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label="Chẩn đoán"
              />
            )
          }}
        />

        <TextField
          label="Chẩn đoán cận lâm sàng"
          multiline
          type="text"
          rows={3}
          {...register('diagnosis', {})}
        />
        <TextField
          label="Lời khuyên bác sĩ"
          multiline
          type="text"
          rows={3}
          {...register('doctorAdvice', {})}
        />
      </Stack>
    </form>
  )
}

export default Checkup
