import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller.js';
import { AdminEventsController } from './admin-events.controller.js';
import { AppEventsController } from './app-events.controller.js';
import { EventsService } from './events.service.js';

describe('Events Controllers', () => {
  let eventsController: EventsController;
  let adminEventsController: AdminEventsController;
  let appEventsController: AppEventsController;
  let service: any;

  beforeEach(async () => {
    service = {
      getEvents: jest.fn(),
      getEventById: jest.fn(),
      createEvent: jest.fn(),
      updateEvent: jest.fn(),
      deleteEvent: jest.fn(),
      joinEvent: jest.fn(),
      getEventParticipants: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        EventsController,
        AdminEventsController,
        AppEventsController,
      ],
      providers: [{ provide: EventsService, useValue: service }],
    }).compile();

    eventsController = module.get<EventsController>(EventsController);
    adminEventsController = module.get<AdminEventsController>(AdminEventsController);
    appEventsController = module.get<AppEventsController>(AppEventsController);
  });

  describe('EventsController', () => {
    it('should get events', async () => {
      service.getEvents.mockResolvedValue({ status: 'success', data: { items: [] } });
      const res = await eventsController.getEvents({ page: 1 });
      expect(res.status).toBe('success');
      expect(service.getEvents).toHaveBeenCalledWith({ page: 1 });
    });

    it('should get event by id', async () => {
      service.getEventById.mockResolvedValue({ status: 'success', data: { id: 'evt-1' } });
      const res = await eventsController.getEventById('evt-1');
      expect(res.status).toBe('success');
      expect(service.getEventById).toHaveBeenCalledWith('evt-1');
    });

    it('should join event', async () => {
      service.joinEvent.mockResolvedValue({ status: 'success' });
      const res = await eventsController.joinEvent('evt-1', 'runner-1');
      expect(res.status).toBe('success');
      expect(service.joinEvent).toHaveBeenCalledWith('evt-1', 'runner-1');
    });
  });

  describe('AdminEventsController', () => {
    it('should list all events for admin', async () => {
      service.getEvents.mockResolvedValue({ status: 'success', data: { items: [] } });
      const res = await adminEventsController.getEvents({});
      expect(res.status).toBe('success');
      expect(service.getEvents).toHaveBeenCalled();
    });

    it('should create an event', async () => {
      const dto: any = { title: 'New 10K', description: 'Desc' };
      service.createEvent.mockResolvedValue({ status: 'success', data: { id: 'evt-2' } });
      const res = await adminEventsController.createEvent(dto);
      expect(res.status).toBe('success');
      expect(service.createEvent).toHaveBeenCalledWith(dto);
    });

    it('should update an event', async () => {
      const dto: any = { title: 'Updated 10K' };
      service.updateEvent.mockResolvedValue({ status: 'success' });
      const res = await adminEventsController.updateEvent('evt-2', dto);
      expect(res.status).toBe('success');
      expect(service.updateEvent).toHaveBeenCalledWith('evt-2', dto);
    });

    it('should delete an event', async () => {
      service.deleteEvent.mockResolvedValue({ status: 'success' });
      const res = await adminEventsController.deleteEvent('evt-2');
      expect(res.status).toBe('success');
      expect(service.deleteEvent).toHaveBeenCalledWith('evt-2');
    });

    it('should get event participants', async () => {
      service.getEventParticipants.mockResolvedValue({ status: 'success', data: {} });
      const res = await adminEventsController.getEventParticipants('evt-2', 1, 10);
      expect(res.status).toBe('success');
      expect(service.getEventParticipants).toHaveBeenCalledWith('evt-2', 1, 10);
    });
  });

  describe('AppEventsController', () => {
    it('should get published events for runners', async () => {
      service.getEvents.mockResolvedValue({ status: 'success', data: { items: [] } });
      const res = await appEventsController.getEvents({});
      expect(res.status).toBe('success');
      expect(service.getEvents).toHaveBeenCalled();
    });

    it('should get runner event by id with user participation', async () => {
      service.getEventById.mockResolvedValue({ status: 'success', data: { id: 'evt-1' } });
      const res = await appEventsController.getEventById('evt-1', 'runner-1');
      expect(res.status).toBe('success');
      expect(service.getEventById).toHaveBeenCalledWith('evt-1', 'runner-1');
    });

    it('should join event via app controller', async () => {
      service.joinEvent.mockResolvedValue({ status: 'success' });
      const res = await appEventsController.joinEvent('evt-1', 'runner-1');
      expect(res.status).toBe('success');
      expect(service.joinEvent).toHaveBeenCalledWith('evt-1', 'runner-1');
    });
  });
});

