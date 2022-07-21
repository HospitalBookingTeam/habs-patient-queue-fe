import { TextField, TextFieldProps } from '@mui/material'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export default function ControlledDatepicker({
	name,
	rules,
	defaultValue = null,
	dateProps,
	...rest
}: {
	name: any
	rules?: Exclude<
		RegisterOptions,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs'
	>
	defaultValue?: Date | null
	dateProps?: Omit<
		DatePickerProps<any, any>,
		'onChange' | 'renderInput' | 'value'
	>
} & TextFieldProps) {
	const { control } = useFormContext()
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			defaultValue={defaultValue}
			render={({
				field: { ref, onChange, ...field },
				fieldState: { error },
			}) => {
				return (
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							{...field}
							{...dateProps}
							inputFormat="dd-MM-yyyy"
							disabled={rest?.disabled}
							renderInput={(params: TextFieldProps) => (
								<TextField
									{...params}
									{...rest}
									inputRef={ref}
									error={!!error}
									helperText={error?.message}
								/>
							)}
							onChange={(value: any) => {
								onChange(moment(value).toDate())
							}}
						/>
					</LocalizationProvider>
				)
			}}
		/>
	)
}
