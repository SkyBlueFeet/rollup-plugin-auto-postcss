import autoImport from "import-cwd";

type InstallationStatus = {
    installed: boolean;
    module?: any;
};

export default function(mde: string): InstallationStatus {
    let installed = true;
    try {
        require(mde);
    } catch (error) {
        installed = false;
    }

    return {
        installed,
        module: autoImport.silent(mde) as Function
    };
}
