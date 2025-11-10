using CommunityCar.Domain.Common;
using CommunityCar.Domain.Interfaces;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CommunityCar.Infrastructure.Repositories;

public class BaseRepository<TEntity> : IRepository<TEntity> where TEntity : BaseEntity
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<TEntity> _dbSet;

    public BaseRepository(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _dbSet = context.Set<TEntity>();
    }

    // Basic CRUD operations
    public virtual async Task<TEntity?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate)
    {
        return await _dbSet.Where(predicate).ToListAsync();
    }

    public virtual async Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate)
    {
        return await _dbSet.FirstOrDefaultAsync(predicate);
    }

    public virtual async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate)
    {
        return await _dbSet.AnyAsync(predicate);
    }

    public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null)
    {
        return predicate == null
            ? await _dbSet.CountAsync()
            : await _dbSet.CountAsync(predicate);
    }

    // Add operations
    public virtual async Task<TEntity> AddAsync(TEntity entity)
    {
        entity.UpdateTimestamp();
        var entry = await _dbSet.AddAsync(entity);
        return entry.Entity;
    }

    public virtual async Task<IEnumerable<TEntity>> AddRangeAsync(IEnumerable<TEntity> entities)
    {
        var entityList = entities.ToList();
        foreach (var entity in entityList)
        {
            entity.UpdateTimestamp();
        }

        await _dbSet.AddRangeAsync(entityList);
        return entityList;
    }

    // Update operations
    public virtual async Task UpdateAsync(TEntity entity)
    {
        entity.UpdateTimestamp();
        _context.Entry(entity).State = EntityState.Modified;
        await Task.CompletedTask;
    }

    public virtual async Task UpdateRangeAsync(IEnumerable<TEntity> entities)
    {
        var entityList = entities.ToList();
        foreach (var entity in entityList)
        {
            entity.UpdateTimestamp();
            _context.Entry(entity).State = EntityState.Modified;
        }
        await Task.CompletedTask;
    }

    // Soft delete operations
    public virtual async Task SoftDeleteAsync(int id, string? deletedBy = null)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            await SoftDeleteAsync(entity, deletedBy);
        }
    }

    public virtual async Task SoftDeleteAsync(TEntity entity, string? deletedBy = null)
    {
        entity.SoftDelete(deletedBy);
        await UpdateAsync(entity);
    }

    public virtual async Task SoftDeleteRangeAsync(IEnumerable<TEntity> entities, string? deletedBy = null)
    {
        var entityList = entities.ToList();
        foreach (var entity in entityList)
        {
            entity.SoftDelete(deletedBy);
        }
        await UpdateRangeAsync(entityList);
    }

    public virtual async Task RestoreAsync(int id)
    {
        var entity = await GetByIdIncludingDeletedAsync(id);
        if (entity != null)
        {
            await RestoreAsync(entity);
        }
    }

    public virtual async Task RestoreAsync(TEntity entity)
    {
        entity.Restore();
        await UpdateAsync(entity);
    }

    public virtual async Task RestoreRangeAsync(IEnumerable<TEntity> entities)
    {
        var entityList = entities.ToList();
        foreach (var entity in entityList)
        {
            entity.Restore();
        }
        await UpdateRangeAsync(entityList);
    }

    // Hard delete operations (use with caution)
    public virtual async Task HardDeleteAsync(int id)
    {
        var entity = await GetByIdIncludingDeletedAsync(id);
        if (entity != null)
        {
            await HardDeleteAsync(entity);
        }
    }

    public virtual async Task HardDeleteAsync(TEntity entity)
    {
        _dbSet.Remove(entity);
        await Task.CompletedTask;
    }

    public virtual async Task HardDeleteRangeAsync(IEnumerable<TEntity> entities)
    {
        _dbSet.RemoveRange(entities);
        await Task.CompletedTask;
    }

    // Include deleted records (admin operations)
    public virtual async Task<IEnumerable<TEntity>> GetAllIncludingDeletedAsync()
    {
        return await _dbSet.IgnoreQueryFilters().ToListAsync();
    }

    public virtual async Task<IEnumerable<TEntity>> FindIncludingDeletedAsync(Expression<Func<TEntity, bool>> predicate)
    {
        return await _dbSet.IgnoreQueryFilters().Where(predicate).ToListAsync();
    }

    public virtual async Task<TEntity?> GetByIdIncludingDeletedAsync(int id)
    {
        return await _dbSet.IgnoreQueryFilters().FirstOrDefaultAsync(e => e.Id == id);
    }

    // Bulk operations - commented out as EF Core doesn't have built-in bulk operations
    // These would require additional packages like EFCore.BulkExtensions
    // public virtual async Task BulkInsertAsync(IEnumerable<TEntity> entities)
    // {
    //     await _context.BulkInsertAsync(entities);
    // }

    // public virtual async Task BulkUpdateAsync(IEnumerable<TEntity> entities)
    // {
    //     await _context.BulkUpdateAsync(entities);
    // }

    public virtual async Task BulkSoftDeleteAsync(IEnumerable<TEntity> entities, string? deletedBy = null)
    {
        await SoftDeleteRangeAsync(entities, deletedBy);
    }

    public virtual async Task BulkHardDeleteAsync(IEnumerable<TEntity> entities)
    {
        await HardDeleteRangeAsync(entities);
    }

    // Save changes
    public virtual async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}