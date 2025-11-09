using CommunityCar.Domain.Common;
using System.Linq.Expressions;

namespace CommunityCar.Domain.Interfaces;

public interface IRepository<TEntity> where TEntity : BaseEntity
{
    // Basic CRUD operations
    Task<TEntity?> GetByIdAsync(int id);
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate);
    Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate);
    Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate);
    Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null);

    // Add operations
    Task<TEntity> AddAsync(TEntity entity);
    Task<IEnumerable<TEntity>> AddRangeAsync(IEnumerable<TEntity> entities);

    // Update operations
    Task UpdateAsync(TEntity entity);
    Task UpdateRangeAsync(IEnumerable<TEntity> entities);

    // Soft delete operations
    Task SoftDeleteAsync(int id, string? deletedBy = null);
    Task SoftDeleteAsync(TEntity entity, string? deletedBy = null);
    Task SoftDeleteRangeAsync(IEnumerable<TEntity> entities, string? deletedBy = null);
    Task RestoreAsync(int id);
    Task RestoreAsync(TEntity entity);
    Task RestoreRangeAsync(IEnumerable<TEntity> entities);

    // Hard delete operations (use with caution)
    Task HardDeleteAsync(int id);
    Task HardDeleteAsync(TEntity entity);
    Task HardDeleteRangeAsync(IEnumerable<TEntity> entities);

    // Include deleted records (admin operations)
    Task<IEnumerable<TEntity>> GetAllIncludingDeletedAsync();
    Task<IEnumerable<TEntity>> FindIncludingDeletedAsync(Expression<Func<TEntity, bool>> predicate);
    Task<TEntity?> GetByIdIncludingDeletedAsync(int id);

    // Bulk operations
    Task BulkInsertAsync(IEnumerable<TEntity> entities);
    Task BulkUpdateAsync(IEnumerable<TEntity> entities);
    Task BulkSoftDeleteAsync(IEnumerable<TEntity> entities, string? deletedBy = null);
    Task BulkHardDeleteAsync(IEnumerable<TEntity> entities);

    // Save changes
    Task<int> SaveChangesAsync();
}