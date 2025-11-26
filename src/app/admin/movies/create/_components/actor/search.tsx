import { Input } from "@/components/ui/input";
import SearchService from "@/services/search.service";
import { IActorSearch } from "@/types/search.type";
import { Check, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SearchProps {
  selectedActor: IActorSearch[];
  handleSelectActor: (actor: IActorSearch) => void;
}

export const Search = ({
  selectedActor,
  handleSelectActor,
}: SearchProps) => {

  const [dataSearch, setDataSearch] = useState<IActorSearch[]>([]);
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
    fetchSearchActorResult();
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


  const fetchSearchActorResult = async () => {
    if (debouncedKeyword.trim() === "") {
      setDataSearch([]);
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    setShowDropdown(true);
    try {
      const res = await SearchService.searchActor(debouncedKeyword);
      await new Promise((r) => setTimeout(r, 500));
      if (res && res.EC === 1) {
        if (
          res.data !== undefined &&
          res.data.actors.length > 0
        ) {
          setDataSearch(res.data.actors);
        } else {
          setDataSearch([]);
        }
      }
    } catch (error) {
      console.log("Error from search actor fetch function: ", error);
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

  const handleSelect = (item: IActorSearch) => {
    setKeyword("");
    setDebouncedKeyword("");
    setShowDropdown(false);
    setDataSearch([]);

    handleSelectActor(item);
  }

  return (
    <div ref={wrapperRef}>
      <div className="relative">
        <Input
          value={keyword}
          placeholder={"Nhập tên diễn viên để tìm kiếm"}
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
                <span className="ml-1.5">Đang tìm diễn viên</span>
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
                <p className="text-amber-400 text-sm mb-2">Danh sách diễn viên</p>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {dataSearch.map((actor) => {
                    const isSelected = selectedActor.some((item) => item.actorId === actor.actorId);
                    return (
                      <div
                        key={actor.actorId}
                        onClick={() => handleSelect(actor)}
                        className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[#2a3040] rounded-lg transition"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-white font-semibold text-sm">
                            {actor.actorName}
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