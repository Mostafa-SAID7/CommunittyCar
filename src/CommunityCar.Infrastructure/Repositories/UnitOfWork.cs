using CommunityCar.Domain.Common;
using CommunityCar.Domain.Interfaces;
using CommunityCar.Infrastructure.Data;

namespace CommunityCar.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private readonly Dictionary<Type, object> _repositories;
    private bool _disposed;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _repositories = new Dictionary<Type, object>();
    }

    public IRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
    {
        var type = typeof(TEntity);

        if (!_repositories.ContainsKey(type))
        {
            var repositoryType = typeof(BaseRepository<>).MakeGenericType(type);
            var repositoryInstance = Activator.CreateInstance(repositoryType, _context);
            _repositories[type] = repositoryInstance!;
        }

        return (IRepository<TEntity>)_repositories[type];
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task<int> SaveChangesAsync(System.Threading.CancellationToken cancellationToken)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync()
    {
        await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        await _context.Database.CommitTransactionAsync();
    }

    public async Task RollbackTransactionAsync()
    {
        await _context.Database.RollbackTransactionAsync();
    }

    public bool HasActiveTransaction => _context.Database.CurrentTransaction != null;

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _context.Dispose();
                _repositories.Clear();
            }
            _disposed = true;
        }
    }
}