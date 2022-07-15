import { TextField, TextFieldProps } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { isEqual } from 'lodash'
import {
	Controller,
	FieldName,
	RegisterOptions,
	useFormContext,
} from 'react-hook-form'

export type Option = {
	label: string
	value: string
}

export default function ControlledAutocomplete({
	name,
	rules,
	options,
	getOptionLabel,
	multiple,
	...rest
}: {
	name: any
	rules?: Exclude<
		RegisterOptions,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs'
	>
	options: (Option & any)[]
	multiple?: boolean
	getOptionLabel?: ((option: any) => string) | undefined
} & TextFieldProps) {
	const { control } = useFormContext()

	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			defaultValue={multiple ? [] : null}
			render={({ field: { ref, ...field }, fieldState: { error } }) => {
				return (
					<Autocomplete
						{...field}
						multiple={multiple}
						handleHomeEndKeys
						options={options}
						getOptionLabel={getOptionLabel}
						isOptionEqualToValue={(option, value) => isEqual(option, value)}
						renderInput={(params) => (
							<TextField
								{...params}
								{...rest}
								inputRef={ref}
								error={!!error}
								helperText={error?.message}
							/>
						)}
						onChange={(e, value) => field.onChange(value)}
						onInputChange={(_, data) => {
							if (multiple) {
								if (!!data && Array.isArray(data)) {
									field.onChange(data)
								}
								return
							}
							if (data) field.onChange(data)
						}}
					/>
				)
			}}
		/>
	)
}
