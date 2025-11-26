import { Input } from "@/components/ui/input";
import SearchService from "@/services/search.service";
import { IProducerSearch } from "@/types/search.type";
import { Check, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SearchProps {
  selectedProducer: IProducerSearch[];
  handleSelectProducer: (producer: IProducerSearch) => void;
}

export const Search = ({
  selectedProducer,
  handleSelectProducer,
}: SearchProps) => {

  const [dataSearch, setDataSearch] = useState<IProducerSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (keyword.trim() === "") {
      setShowDropdown(false);
      setDataSearch([]);
      return;
    }
    const searchHander = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(searchHander);
  }, [keyword]);

  useEffect(() => {
    if (debouncedKeyword.trim() === "") return;
    fetchSearchProducerResult();
  }, [debouncedKeyword]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const fetchSearchProducerResult = async () => {
    if (debouncedKeyword.trim() === "") {
      setDataSearch([]);
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    setShowDropdown(true);
    try {
      const res = await SearchService.searchProducer(debouncedKeyword);
      await new Promise((r) => setTimeout(r, 500));
      if (res && res.EC === 1) {
        if (
          res.data !== undefined &&
          res.data.producers.length > 0
        ) {
          setDataSearch(res.data.producers);
        } else {
          setDataSearch([]);
        }
      }
    } catch (error) {
      console.log("Error from search film fetch function: ", error);
      toast.error("Có lỗi xảy ra khi tìm kiếm, vui lòng thử lại khi khác");
    } finally {
      setIsSearching(false);
    }
  };

  const handleChangSeachValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKeyword(event.target.value);
    setDataSearch([]);
  };

  const handleSelect = (item: IProducerSearch) => {
    setKeyword("");
    setDebouncedKeyword("");
    setShowDropdown(false);
    setDataSearch([]);

    handleSelectProducer(item);
  }

  return (
    <div ref={wrapperRef}>
      <div className="relative">
        <Input
          value={keyword}
          placeholder={"Nhập tên nhà sản xuất để tìm kiếm"}
          onChange={handleChangSeachValue}
        />
        {showDropdown && (
          <div className="absolute mt-2 left-0 w-full bg-[#1a1f2e] border border-[#2a3040] rounded-xl shadow-xl p-3 z-50">
            {isSearching && (
              <div className="flex items-center justify-center py-6 text-gray-400">
                <Loader
                  className="animate-spin"
                  size={20}
                  style={{ animationDuration: "1.5s" }}
                />{" "}
                <span className="ml-1.5">Đang tìm nhà sản xuất</span>
              </div>
            )}

            {/* Không có kết quả */}
            {!isSearching && dataSearch.length === 0 && (
              <div className="text-gray-400 text-center py-4">
                Không tìm thấy kết quả nào
              </div>
            )}

            {/* Có kết quả */}
            {!isSearching && dataSearch.length > 0 && (
              <>
                <p className="text-amber-400 text-sm mb-2">
                  Danh sách nhà sản xuất
                </p>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {dataSearch.map((producer) => {
                    const isSelected = selectedProducer.some((item) => item.producerId === producer.producerId);
                    return (
                      <div
                        key={producer.producerId}
                        onClick={() => handleSelect(producer)}
                        className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[#2a3040] rounded-lg transition"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-white font-semibold text-sm">
                            {producer.producerName}
                          </div>
                          {isSelected && (
                            <Check className="ml-auto h-4 w-4 text-amber-400" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};