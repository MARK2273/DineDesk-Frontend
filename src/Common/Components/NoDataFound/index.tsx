import Icon from "../Icon";

export const NoDataFound = () => {
  return (
    <div className="h-full w-full flex items-center justify-center my-10">
      <div className="inline-flex flex-col gap-30px">
        <div className="relative text-center">
          <Icon name="noDataFound" className="mx-auto inline-block" />
        </div>
        <div className="relative flex flex-col gap-3">
          <h4 className="text-22px font-semibold leading-25px text-Primary-900 text-center">
            No Data Found
          </h4>
          <p className="text-base font-medium leading-18px text-Gray-700-opacity-70 text-center">
            We couldn’t retrieve any <br /> data at the moment
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoDataFound;
