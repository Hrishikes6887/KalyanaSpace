import { storage } from './storage';
import { Enquiry, EnquiryStatus } from '../types';

export const enquiryService = {
  getAllEnquiries(): Enquiry[] {
    return storage.getEnquiries();
  },

  getEnquiriesByCustomer(customerId: string): Enquiry[] {
    return storage.getEnquiries().filter(e => e.customerId === customerId);
  },

  getEnquiriesByOwner(ownerId: string): Enquiry[] {
    return storage.getEnquiries().filter(e => e.ownerId === ownerId);
  },

  getEnquiryById(id: string): Enquiry | undefined {
    return storage.getEnquiries().find(e => e.id === id);
  },

  createEnquiry(data: {
    venueId: string;
    venueName: string;
    venueCity: string;
    ownerId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventType: Enquiry['eventType'];
    eventDate: string;
    guestCount: number;
    estimatedBudget: number;
    additionalRequirements?: string;
  }): Enquiry {
    const enquiries = storage.getEnquiries();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `ENQ-2024-${randomSuffix}`;

    const newEnquiry: Enquiry = {
      ...data,
      id: newId,
      status: 'new',
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    enquiries.unshift(newEnquiry);
    storage.setEnquiries(enquiries);

    storage.addActivityLog({
      actorId: data.customerId,
      actorName: data.customerName,
      action: 'enquiry_created',
      targetType: 'enquiry',
      targetId: newId,
      description: `New enquiry for ${data.venueName} on ${data.eventDate}`,
    });

    return newEnquiry;
  },

  updateStatus(
    id: string,
    status: EnquiryStatus,
    noteText?: string,
    authorName = 'Staff',
    authorId = 'owner'
  ): Enquiry | null {
    const enquiries = storage.getEnquiries();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;

    const current = enquiries[index];
    const notes = [...current.notes];

    if (noteText && noteText.trim()) {
      notes.push({
        id: `note_${Date.now()}`,
        authorId,
        authorName,
        note: noteText.trim(),
        createdAt: new Date().toISOString(),
      });
    }

    const updated: Enquiry = {
      ...current,
      status,
      notes,
      updatedAt: new Date().toISOString(),
    };

    enquiries[index] = updated;
    storage.setEnquiries(enquiries);

    storage.addActivityLog({
      actorId: authorId,
      actorName: authorName,
      action: `enquiry_status_${status}`,
      targetType: 'enquiry',
      targetId: id,
      description: `Enquiry ${id} status updated to ${status}`,
    });

    return updated;
  },

  addNote(id: string, noteText: string, authorId: string, authorName: string): Enquiry | null {
    const enquiries = storage.getEnquiries();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;

    const current = enquiries[index];
    const newNote = {
      id: `note_${Date.now()}`,
      authorId,
      authorName,
      note: noteText.trim(),
      createdAt: new Date().toISOString(),
    };

    current.notes.push(newNote);
    current.updatedAt = new Date().toISOString();

    enquiries[index] = current;
    storage.setEnquiries(enquiries);

    return current;
  },

  scheduleVisit(id: string, visitDateTime: string, authorName = 'Owner'): Enquiry | null {
    const enquiries = storage.getEnquiries();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;

    const current = enquiries[index];
    current.visitDate = visitDateTime;
    current.status = 'visit_scheduled';
    current.updatedAt = new Date().toISOString();
    current.notes.push({
      id: `note_${Date.now()}`,
      authorId: current.ownerId,
      authorName,
      note: `Site visit scheduled for ${new Date(visitDateTime).toLocaleString()}`,
      createdAt: new Date().toISOString(),
    });

    enquiries[index] = current;
    storage.setEnquiries(enquiries);
    return current;
  },

  updateFollowUp(id: string, followUpDate: string): Enquiry | null {
    const enquiries = storage.getEnquiries();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;

    enquiries[index].followUpDate = followUpDate;
    enquiries[index].updatedAt = new Date().toISOString();
    storage.setEnquiries(enquiries);
    return enquiries[index];
  },

  setQuotation(id: string, amount: number, authorName = 'Owner'): Enquiry | null {
    const enquiries = storage.getEnquiries();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;

    const current = enquiries[index];
    current.quotationAmount = amount;
    current.status = 'quotation_shared';
    current.updatedAt = new Date().toISOString();
    current.notes.push({
      id: `note_${Date.now()}`,
      authorId: current.ownerId,
      authorName,
      note: `Quotation shared for ₹${amount.toLocaleString('en-IN')}`,
      createdAt: new Date().toISOString(),
    });

    enquiries[index] = current;
    storage.setEnquiries(enquiries);
    return current;
  },

  assignCoordinator(id: string, coordinatorName: string): Enquiry | null {
    const enquiries = storage.getEnquiries();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;

    enquiries[index].assignedCoordinator = coordinatorName;
    enquiries[index].updatedAt = new Date().toISOString();
    storage.setEnquiries(enquiries);
    return enquiries[index];
  },

  withdrawEnquiry(id: string, customerId: string): Enquiry | null {
    const enquiries = storage.getEnquiries();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;

    const current = enquiries[index];
    if (current.customerId !== customerId) return null;

    current.status = 'withdrawn';
    current.updatedAt = new Date().toISOString();
    current.notes.push({
      id: `note_${Date.now()}`,
      authorId: customerId,
      authorName: current.customerName,
      note: 'Withdrawn by customer.',
      createdAt: new Date().toISOString(),
    });

    enquiries[index] = current;
    storage.setEnquiries(enquiries);
    return current;
  }
};
