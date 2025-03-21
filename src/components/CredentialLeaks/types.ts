
export interface CredentialLeak {
  id: string;
  email: string;
  username: string;
  notification_date: Date;
  notification_source: string;
  action_taken: string | null;
  partial_password?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CredentialLeakLog {
  id: string;
  credential_leak_id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  details: any;
  created_at: Date;
  user_id?: string;
}

export interface CreateCredentialLeakFormValues {
  email: string;
  username: string;
  notification_date: Date;
  notification_source: string;
  action_taken?: string;
  partial_password?: string;
}

export interface EditCredentialLeakFormValues extends CreateCredentialLeakFormValues {}
