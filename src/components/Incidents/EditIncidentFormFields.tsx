
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EditIncidentFormValues } from './types';
import { IncidentBasicFormFields } from './IncidentBasicFormFields';
import { IncidentStatusSeverityFields } from './IncidentStatusSeverityFields';
import { IncidentTypeSelector } from './IncidentTypeSelector';

interface EditIncidentFormFieldsProps {
  form: UseFormReturn<EditIncidentFormValues>;
}

export const EditIncidentFormFields: React.FC<EditIncidentFormFieldsProps> = ({ form }) => {
  return (
    <>
      <IncidentBasicFormFields form={form} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <IncidentStatusSeverityFields form={form} />
        <IncidentTypeSelector form={form} />
      </div>
    </>
  );
};
