export class ControllerOmitHelper {
  static omitArray<T = any>(dto: any[], omitMethod: (dto: any) => T): T[] {
    return dto.map(omitMethod);
  }

  static omitUserId<T = any>(dto: T & { userId?: unknown }): T {
    const dtoCopy = { ...dto };
    delete dtoCopy.userId;
    return dtoCopy;
  }

  static omitUserIdArray<T = any>(dto: T & { userId?: unknown }[]): T[] {
    return ControllerOmitHelper.omitArray(dto, ControllerOmitHelper.omitUserId);
  }

  static omitCreatedAt<T = any>(dto: T & { createdAt?: unknown }): T {
    const dtoCopy = { ...dto };
    delete dtoCopy.createdAt;
    return dtoCopy;
  }

  static omitUpdatedAt<T = any>(dto: T & { updatedAt?: unknown }): T {
    const dtoCopy = { ...dto };
    delete dtoCopy.updatedAt;
    return dtoCopy;
  }

  static omitCreatedUpdatedAt<T = any>(
    dto: T & { createdAt?: unknown; updatedAt?: unknown },
  ): T {
    return ControllerOmitHelper.omitUpdatedAt(
      ControllerOmitHelper.omitCreatedAt(dto),
    );
  }

  static omitCreatedUpdatedAtArray<T = any>(
    dto: T & { createdAt?: unknown; updatedAt?: unknown }[],
  ): T[] {
    return ControllerOmitHelper.omitArray(
      dto,
      ControllerOmitHelper.omitCreatedUpdatedAt,
    );
  }
}
