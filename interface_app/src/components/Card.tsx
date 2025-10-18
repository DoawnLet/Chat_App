import React from "react";

const Card = () => {
  return (
    <>
      <section className="py-1 px-1 sm:px-2 lg:px-2">
        <article className="flex flex-wrap md:flex-nowrap shadow-md w-full group cursor-pointer transform duration-300 hover:-translate-y-0.5 bg-card border border-border rounded-md overflow-hidden">
          <img
            className="w-full max-h-[280px] object-cover md:w-64 lg:w-72"
            src={
              "https://i.pinimg.com/originals/2d/15/05/2d1505109c25491c7cc1800d64af4a47.jpg"
            }
            alt="The Magnificent Bogra"
          />
          {/* Do hiện tại vẫn chưa có hình ảnh nên để thông báo như vậy */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 pb-3 flex-1">
              <h1 className="text-xl lg:text-2xl font-semibold text-foreground mt-1">
                The Magnificent Bogra (Your Name)
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground mt-2 leading-relaxed">
                Located in Rajshahi Division, Bogra is one of the oldest and
                most fascinating towns in Bangladesh. Experience rich history,
                ancient architecture, and vibrant local culture. (Description
                each Person)
              </p>
            </div>

            <div className="bg-accent/20 p-4 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="space-y-2">
                  <div className="text-base text-foreground">
                    <span className="text-foreground font-bold text-lg">
                      196 km
                    </span>{" "}
                    from Dhaka (Location)
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Star Rating */}
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 mx-px fill-current text-yellow-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 14 14"
                        >
                          <path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z"></path>
                        </svg>
                      ))}
                    </div>

                    <div className="text-muted-foreground text-sm">
                      <span className="font-semibold text-foreground">4.8</span>{" "}
                      (16 reviews)
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      View detail
                    </div>
                  </div>

                  <button className="py-2 px-4 lg:py-3 lg:px-6 bg-amber-500 hover:bg-amber-700/90 font-semibold text-primary-foreground text-sm lg:text-base rounded-md shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105">
                    Add Friend
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-border/50">
                <p className="text-muted-foreground text-xs lg:text-sm">
                  <span className="font-medium">Places to visit:</span>{" "}
                  Mahasthangarh, Vasu Bihar & Momo Inn
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default Card;
