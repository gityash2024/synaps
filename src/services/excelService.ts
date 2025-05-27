interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: string;
}

class ExcelService {
  private readonly GOOGLE_APPS_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SHEETS_URL;
  private readonly BACKUP_ENDPOINT = process.env.REACT_APP_BACKUP_SHEETS_URL;

  async submitContactForm(formData: ContactFormData): Promise<boolean> {
    const dataWithTimestamp = {
      ...formData,
      timestamp: new Date().toISOString(),
      source: 'Synapses Contact Form'
    };

    try {
      await this.submitToGoogleSheets(dataWithTimestamp);
      return true;
    } catch (error) {
      console.error('Primary submission failed:', error);
      
      try {
        await this.submitToBackupService(dataWithTimestamp);
        return true;
      } catch (backupError) {
        console.error('Backup submission failed:', backupError);
        await this.storeLocally(dataWithTimestamp);
        throw new Error('Failed to submit form. Data stored locally for retry.');
      }
    }
  }

  private async submitToGoogleSheets(data: ContactFormData & { timestamp: string; source: string }): Promise<void> {
    if (!this.GOOGLE_APPS_SCRIPT_URL) {
      throw new Error('Google Sheets URL not configured');
    }

    const response = await fetch(this.GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok && response.type !== 'opaque') {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  private async submitToBackupService(data: ContactFormData & { timestamp: string; source: string }): Promise<void> {
    if (!this.BACKUP_ENDPOINT) {
      throw new Error('Backup endpoint not configured');
    }

    const response = await fetch(this.BACKUP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Backup submission failed! status: ${response.status}`);
    }
  }

  private async storeLocally(data: ContactFormData & { timestamp: string; source: string }): Promise<void> {
    try {
      const existingData = localStorage.getItem('pendingContactForms');
      const pendingForms = existingData ? JSON.parse(existingData) : [];
      
      pendingForms.push(data);
      localStorage.setItem('pendingContactForms', JSON.stringify(pendingForms));
      
      console.log('Form data stored locally for retry');
    } catch (error) {
      console.error('Failed to store data locally:', error);
    }
  }

  async retryPendingSubmissions(): Promise<void> {
    try {
      const pendingData = localStorage.getItem('pendingContactForms');
      if (!pendingData) return;

      const pendingForms: (ContactFormData & { timestamp: string; source: string })[] = JSON.parse(pendingData);
      const successful: number[] = [];

      for (let i = 0; i < pendingForms.length; i++) {
        try {
          await this.submitToGoogleSheets(pendingForms[i]);
          successful.push(i);
        } catch (error) {
          console.error(`Failed to retry submission ${i}:`, error);
        }
      }

      if (successful.length > 0) {
        const remaining = pendingForms.filter((_, index) => !successful.includes(index));
        if (remaining.length === 0) {
          localStorage.removeItem('pendingContactForms');
        } else {
          localStorage.setItem('pendingContactForms', JSON.stringify(remaining));
        }
        console.log(`Successfully retried ${successful.length} submissions`);
      }
    } catch (error) {
      console.error('Error retrying pending submissions:', error);
    }
  }

  getPendingSubmissionsCount(): number {
    try {
      const pendingData = localStorage.getItem('pendingContactForms');
      return pendingData ? JSON.parse(pendingData).length : 0;
    } catch {
      return 0;
    }
  }
}

export const excelService = new ExcelService();