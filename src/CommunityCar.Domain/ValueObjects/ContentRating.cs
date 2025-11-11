namespace CommunityCar.Domain.ValueObjects;

public enum ContentRating
{
    Safe = 1,
    Questionable = 2,
    Explicit = 3
}

public class ContentRatingValue
{
    public ContentRating Rating { get; private set; }
    public string Description { get; private set; }

    private ContentRatingValue(ContentRating rating, string description)
    {
        Rating = rating;
        Description = description;
    }

    public static ContentRatingValue Safe => new(ContentRating.Safe, "Content is safe for all audiences");
    public static ContentRatingValue Questionable => new(ContentRating.Questionable, "Content may be inappropriate for some audiences");
    public static ContentRatingValue Explicit => new(ContentRating.Explicit, "Content is explicit and not suitable for all audiences");

    public static ContentRatingValue FromRating(ContentRating rating)
    {
        return rating switch
        {
            ContentRating.Safe => Safe,
            ContentRating.Questionable => Questionable,
            ContentRating.Explicit => Explicit,
            _ => throw new ArgumentException("Invalid content rating", nameof(rating))
        };
    }
}