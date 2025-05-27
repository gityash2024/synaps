import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { excelService } from '../services/excelService';
import Loader from '../components/common/Loader';

const faqData = [
  {
    question: 'How do I create a new project?',
    answer: 'You can create a new project from the dashboard by clicking the "Create New Project" button. Fill in the required details in the form that appears, and submit to create your project.'
  },
  {
    question: 'How do I manage resource allocation?',
    answer: 'Resource allocation can be managed from the project details page. Navigate to your project, select the appropriate tab (Network, Compute, Storage), and you can add or modify resources as needed.'
  },
  {
    question: 'Can I invite team members to my project?',
    answer: 'Yes, you can manage team members from the Admin section. Go to the Admin panel and use the User Management tab to add or manage team members and their access levels.'
  },
  {
    question: 'How do I set up monitoring for my infrastructure?',
    answer: 'Monitoring can be viewed from the dashboard where you can see resource usage trends, project activity, and system statistics. Advanced monitoring features are available in the project details section.'
  },
  {
    question: 'What cloud platforms do you support?',
    answer: 'We support AWS, Azure, Private Cloud, and VMware environments. You can select your preferred platform when creating a new project.'
  },
  {
    question: 'How do I deploy virtual machines?',
    answer: 'To deploy a VM, go to your project details, click "Add Resource", select "Compute" from the service catalog, and choose "Virtual Machine". Fill in the required specifications and deploy.'
  },
  {
    question: 'What support channels are available?',
    answer: 'You can reach us via email at Support@bitmagnus.com, phone at +966 554334451, or submit a support request through this contact form. Our business hours are Sunday-Thursday, 9AM-6PM PST.'
  },
  {
    question: 'How do I backup my data?',
    answer: 'Backup services can be configured from the service catalog in your project. Select "Backup" category and choose the appropriate backup solution for your needs.'
  }
];

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    setPendingCount(excelService.getPendingSubmissionsCount());
    
    if (pendingCount > 0) {
      excelService.retryPendingSubmissions().then(() => {
        setPendingCount(excelService.getPendingSubmissionsCount());
      });
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await excelService.submitContactForm(formData);
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      toast.success('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Message sent but there was an issue with our system. We\'ll still get your message!');
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } finally {
      setIsSubmitting(false);
      setPendingCount(excelService.getPendingSubmissionsCount());
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setErrors({});
  };

  return (
    <div className="pb-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-primary-darkBlue to-primary-teal rounded-xl shadow-md mb-8 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl text-white font-bold font-montserrat mb-2">Contact Us</h1>
          <p className="text-white opacity-90 text-lg">We're here to help with any questions or issues you may have.</p>
          {pendingCount > 0 && (
            <div className="mt-4 p-3 bg-yellow-500 bg-opacity-20 rounded-lg border border-yellow-300 border-opacity-30">
              <p className="text-yellow-100 text-sm">
                📧 {pendingCount} message(s) are queued for delivery and will be sent automatically.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-mint to-primary-teal">
              <h2 className="text-lg font-medium text-primary-darkBlue font-montserrat">Send us a Message</h2>
            </div>
            <div className="p-6">
              {isSubmitted ? (
                <div className="text-center p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3 font-montserrat">Thank You!</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Your message has been sent successfully. Our support team will review your inquiry and get back to you within 24 hours during business hours.
                  </p>
                  <div className="space-y-3">
                    <button 
                      className="px-6 py-3 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat font-medium"
                      onClick={resetForm}
                    >
                      Send Another Message
                    </button>
                    <p className="text-sm text-gray-500">
                      Need urgent assistance? Call us at{' '}
                      <a href="tel:+966554334451" className="text-primary-teal hover:text-primary-darkBlue font-medium">
                        +966 554334451
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-colors ${
                            errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.name}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-colors ${
                            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-colors ${
                          errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="What can we help you with?"
                      />
                      {errors.subject && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.subject}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 font-montserrat">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-colors resize-none ${
                          errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Please describe your issue or question in detail. Include any relevant information that might help us assist you better."
                      ></textarea>
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.message}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        {formData.message.length}/500 characters
                      </p>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center px-6 py-4 bg-primary-mint text-primary-darkBlue rounded-lg hover:bg-primary-teal hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-all duration-200 font-montserrat font-medium ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader size="sm" color="primary" />
                            <span className="ml-3">Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-mint to-primary-teal">
              <h2 className="text-lg font-medium text-primary-darkBlue font-montserrat">Contact Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary-mint bg-opacity-20 text-primary-teal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 font-montserrat">Email</h3>
                    <a 
                      href="mailto:Support@bitmagnus.com" 
                      className="text-sm text-primary-teal hover:text-primary-darkBlue transition-colors"
                    >
                      Support@bitmagnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary-mint bg-opacity-20 text-primary-teal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 font-montserrat">Phone</h3>
                    <a 
                      href="tel:+966554334451" 
                      className="text-sm text-primary-teal hover:text-primary-darkBlue transition-colors"
                    >
                      +966 554334451
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary-mint bg-opacity-20 text-primary-teal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 font-montserrat">Office</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Level 29, Olaya Towers Tower B<br />
                      Intersection of Olaya Street &<br />
                      Mohammed bin Abdul-Aziz Street<br />
                      Riyadh 11523, Saudi Arabia
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary-mint bg-opacity-20 text-primary-teal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 font-montserrat">Business Hours</h3>
                    <div className="text-sm text-gray-600">
                      <p><strong>Sunday - Thursday:</strong> 9AM - 6PM PST</p>
                      <p><strong>Friday & Saturday:</strong> Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-mint bg-opacity-10 rounded-xl p-6 border border-primary-mint border-opacity-20">
            <h3 className="text-lg font-medium text-primary-darkBlue mb-3 font-montserrat">Need Immediate Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              For urgent technical issues or critical system problems, please call us directly during business hours.
            </p>
            <a
              href="tel:+966554334451"
              className="inline-flex items-center px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-primary-darkBlue transition-colors font-montserrat font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now
            </a>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mt-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-mint to-primary-teal">
          <h2 className="text-lg font-medium text-primary-darkBlue font-montserrat">Frequently Asked Questions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-mint transition-colors">
                <button
                  className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-gray-900 font-montserrat">{faq.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-primary-teal transform transition-transform duration-200 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;