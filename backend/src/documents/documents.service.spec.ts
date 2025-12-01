import { DocumentsService } from './documents.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { DocumentStatus } from '../common/enums/document-status.enum';

const prismaMock = {
  document: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  documentRevision: {
    updateMany: jest.fn(),
    create: jest.fn(),
  },
};

describe('DocumentsService', () => {
  const service = new DocumentsService(prismaMock as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('marks previous current revision as superseded when adding a new one', async () => {
    prismaMock.document.findUnique.mockResolvedValue({ id: 'doc-1' });
    prismaMock.documentRevision.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.document.update.mockResolvedValue({ id: 'doc-1', status: DocumentStatus.ISSUED_FOR_REVIEW });
    prismaMock.documentRevision.create.mockResolvedValue({ id: 'rev-2', isCurrent: true });

    const revision = await service.addRevision('doc-1', {
      revisionCode: 'B',
      fileId: 'file-2',
      issueDate: new Date().toISOString(),
      issuerOrganizationId: 'org-1',
      issuedByUserId: 'user-1',
      comments: 'Update',
    });

    expect(prismaMock.documentRevision.updateMany).toHaveBeenCalledWith({
      where: { documentId: 'doc-1', isCurrent: true },
      data: { isCurrent: false, supersededFlag: true },
    });
    expect(prismaMock.documentRevision.create).toHaveBeenCalled();
    expect(revision).toEqual({ id: 'rev-2', isCurrent: true });
  });
});
