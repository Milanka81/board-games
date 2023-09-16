import { useState } from "react";
import { useTranslation } from "react-i18next";
import { memo } from "react";

const Pagination = ({ currentPage, setCurrentPage, count: numPages }) => {
  const { t } = useTranslation(["common"]);
  const [showAllPages, setShowAllPages] = useState(false);
  const handlePrevious = () =>
    currentPage > 1 ? setCurrentPage(currentPage - 1) : currentPage;

  const handleNext = () =>
    currentPage < numPages ? setCurrentPage(currentPage + 1) : numPages;

  const pageNumbers = Array.from({ length: numPages }, (_, i) => i + 1);

  const activePage = (el) =>
    currentPage === el ? "pagination__btnPage-active" : "pagination__btnPage";

  const btnDots = () => (
    <button
      className="pagination__btnPage"
      key="allPages"
      onClick={() => setShowAllPages(true)}
    >
      ...
    </button>
  );

  const secondBtn = () => {
    currentPage > 1 && currentPage <= numPages - 2
      ? setCurrentPage(currentPage)
      : currentPage >= numPages - 1
      ? setCurrentPage(numPages - 2)
      : setCurrentPage(2);
  };

  if (numPages <= 1) return null;

  return (
    <div className="pagination">
      <button className="btn__navBtn-small" onClick={handlePrevious}>
        {t("previous")}
      </button>
      {pageNumbers.length <= 5 || showAllPages ? (
        pageNumbers.map((el, i) => (
          <button
            className={activePage(el)}
            key={i}
            onClick={() => setCurrentPage(el)}
          >
            {el}
          </button>
        ))
      ) : (
        <>
          <button
            className={activePage(1)}
            key="1"
            onClick={() => setCurrentPage(1)}
          >
            1
          </button>
          {currentPage > numPages - 3 ? btnDots() : null}
          <button
            className={
              currentPage > 1 && currentPage < numPages - 1
                ? activePage(currentPage)
                : "pagination__btnPage"
            }
            key="current"
            onClick={secondBtn}
          >
            {currentPage > 1 && currentPage <= numPages - 2
              ? currentPage
              : currentPage >= numPages - 1
              ? numPages - 2
              : 2}
          </button>
          {currentPage < numPages - 2 ? btnDots() : null}
          <button
            className={activePage(numPages - 1)}
            key="next-to-last"
            onClick={() => setCurrentPage(numPages - 1)}
          >
            {numPages - 1}
          </button>
          <button
            className={activePage(numPages)}
            key="last"
            onClick={() => setCurrentPage(numPages)}
          >
            {numPages}
          </button>
        </>
      )}

      <button className="btn__navBtn-small" onClick={handleNext}>
        {t("next")}
      </button>
    </div>
  );
};

export default memo(Pagination);
